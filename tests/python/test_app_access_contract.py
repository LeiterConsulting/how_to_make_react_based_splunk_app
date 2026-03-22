import sys
import types
import unittest
import json
from pathlib import Path



ROOT = Path(__file__).resolve().parents[2]
BIN_DIR = ROOT / 'splunk_app' / 'splunk_react_app' / 'bin'

if str(BIN_DIR) not in sys.path:
    sys.path.insert(0, str(BIN_DIR))


splunk_module = types.ModuleType('splunk')
splunk_rest_module = types.ModuleType('splunk.rest')
splunk_persistconn_module = types.ModuleType('splunk.persistconn')
splunk_persistconn_application_module = types.ModuleType('splunk.persistconn.application')


class PersistentServerConnectionApplication:
    def __init__(self, *args, **kwargs):
        pass


def simple_request_stub(*args, **kwargs):
    raise AssertionError('simpleRequest should be mocked in unit tests')


splunk_rest_module.simpleRequest = simple_request_stub
splunk_persistconn_application_module.PersistentServerConnectionApplication = PersistentServerConnectionApplication

sys.modules.setdefault('splunk', splunk_module)
sys.modules.setdefault('splunk.rest', splunk_rest_module)
sys.modules.setdefault('splunk.persistconn', splunk_persistconn_module)
sys.modules.setdefault('splunk.persistconn.application', splunk_persistconn_application_module)

import app_access  # noqa: E402
import app_access_payloads  # noqa: E402
import app_access_splunk  # noqa: E402


RESTMAP_PATH = ROOT / 'splunk_app' / 'splunk_react_app' / 'default' / 'restmap.conf'


def read_restmap_matches():
    matches = []
    for line in RESTMAP_PATH.read_text(encoding='utf-8').splitlines():
        stripped = line.strip()
        if stripped.startswith('match = '):
            matches.append(stripped.split('=', 1)[1].strip())
    return matches


class AppAccessPayloadTests(unittest.TestCase):
    def test_build_bootstrap_payload_uses_defaults(self):
        payload = app_access_payloads.build_bootstrap_payload(
            path='/servicesNS/nobody/splunk_react_app/app_api/bootstrap',
            method='GET',
            settings={},
            user='admin',
            has_access=True,
        )

        self.assertTrue(payload['ok'])
        self.assertEqual(payload['app']['id'], 'splunk_react_app')
        self.assertEqual(payload['agent_context']['chat_context_file'], 'chat.md')
        self.assertIn('Attach chat.md to the IDE chat session.', payload['next_steps'])

    def test_build_bootstrap_payload_uses_overrides(self):
        payload = app_access_payloads.build_bootstrap_payload(
            path='/services/app_api/bootstrap',
            method='POST',
            settings={
                'preferred_ui_framework': 'custom-react',
                'chat_context_file': 'custom-chat.md',
                'primary_docs': 'docs/a.md, docs/b.md',
                'starter_next_steps': 'First step,Second step',
            },
            user='editor',
            has_access=False,
        )

        self.assertEqual(payload['app']['preferred_ui_framework'], 'custom-react')
        self.assertEqual(payload['agent_context']['chat_context_file'], 'custom-chat.md')
        self.assertEqual(payload['agent_context']['primary_docs'], ['docs/a.md', 'docs/b.md'])
        self.assertEqual(payload['next_steps'], ['First step', 'Second step'])

    def test_build_diagnostics_payload_exposes_known_paths(self):
        payload = app_access_payloads.build_diagnostics_payload(
            path='/services/app_api/diagnostics',
            method='GET',
            required_capability='admin_all_objects',
            has_access=False,
            preferred_ui_framework='splunk-ui-react',
        )

        self.assertEqual(payload['component'], 'app_access')
        self.assertIn('/services/app_api/bootstrap', payload['known_app_api_paths'])
        self.assertEqual(payload['preferred_ui_framework'], 'splunk-ui-react')


class AppRouteRegistrationTests(unittest.TestCase):
    def test_restmap_matches_expected_starter_routes(self):
        expected_matches = {
            f'/{app_access_payloads.APP}/app_api/ping',
            f'/{app_access_payloads.APP}/app_api/bootstrap',
            f'/{app_access_payloads.APP}/app_api/diagnostics',
            '/app_api/ping',
            '/app_api/bootstrap',
            '/app_api/diagnostics',
        }

        self.assertEqual(set(read_restmap_matches()), expected_matches)

    def test_known_paths_cover_registered_route_suffixes(self):
        registered_suffixes = {match.split('/app_api', 1)[1] for match in read_restmap_matches()}
        documented_suffixes = {path.split('/app_api', 1)[1] for path in app_access_payloads.KNOWN_APP_API_PATHS}

        self.assertEqual(registered_suffixes, documented_suffixes)


class AppAccessSplunkHelperTests(unittest.TestCase):
    def test_get_session_key_prefers_nested_session_token(self):
        session_key = app_access_splunk.get_session_key({'session': {'authtoken': 'abc123'}})
        self.assertEqual(session_key, 'abc123')

    def test_normalize_path_strips_query_string(self):
        path = app_access_splunk.normalize_path({'path_info': '/services/app_api/ping?output_mode=json'})
        self.assertEqual(path, '/services/app_api/ping')

    def test_normalize_path_returns_empty_string_when_missing(self):
        path = app_access_splunk.normalize_path({})
        self.assertEqual(path, '')

    def test_get_session_key_falls_back_to_authorization_header(self):
        session_key = app_access_splunk.get_session_key({'headers': {'Authorization': 'Splunk header-token'}})
        self.assertEqual(session_key, 'header-token')


class AppAccessHandlerTests(unittest.TestCase):
    def setUp(self):
        self.original_get_session_key = app_access.get_session_key
        self.original_read_app_settings = app_access.read_app_settings
        self.original_get_current_context = app_access.get_current_context

        app_access.get_session_key = lambda req: 'session-token'
        app_access.read_app_settings = lambda app, session_key: {
            'preferred_ui_framework': 'splunk-ui-react',
            'chat_context_file': 'chat.md',
        }
        app_access.get_current_context = lambda session_key: ('admin', ['admin_all_objects'])

    def tearDown(self):
        app_access.get_session_key = self.original_get_session_key
        app_access.read_app_settings = self.original_read_app_settings
        app_access.get_current_context = self.original_get_current_context

    def test_handle_ping_returns_ok_response(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "GET", "path_info": "/services/app_api/ping"}')
        payload = json.loads(response['payload'])

        self.assertEqual(response['status'], 200)
        self.assertTrue(payload['ok'])
        self.assertEqual(payload['app'], 'splunk_react_app')
        self.assertEqual(payload['path'], '/services/app_api/ping')
        self.assertEqual(payload['method'], 'GET')

    def test_handle_bootstrap_returns_bootstrap_contract(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "GET", "path_info": "/services/app_api/bootstrap"}')
        payload = json.loads(response['payload'])

        self.assertEqual(response['status'], 200)
        self.assertIn('"agent_context"', response['payload'])
        self.assertIn('"prompt_file"', response['payload'])
        self.assertEqual(payload['app']['host_view'], 'home')
        self.assertEqual(payload['app']['preferred_ui_framework'], 'splunk-ui-react')
        self.assertEqual(payload['request_context']['path'], '/services/app_api/bootstrap')

    def test_handle_diagnostics_returns_runtime_contract(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "POST", "path_info": "/services/app_api/diagnostics"}')
        payload = json.loads(response['payload'])

        self.assertEqual(response['status'], 200)
        self.assertEqual(payload['component'], 'app_access')
        self.assertEqual(payload['method'], 'POST')
        self.assertEqual(payload['path'], '/services/app_api/diagnostics')
        self.assertEqual(payload['preferred_ui_framework'], 'splunk-ui-react')
        self.assertIn('/services/app_api/bootstrap', payload['known_app_api_paths'])
        self.assertIn('/custom/splunk_react_app/app_rest_proxy/services/splunk_react_app/app_api', payload['custom_controller_path'])

    def test_handle_normalizes_request_method_to_uppercase(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "post", "path_info": "/services/app_api/ping"}')

        self.assertEqual(response['status'], 200)
        self.assertIn('"method": "POST"', response['payload'])

    def test_handle_empty_request_body_returns_unauthorized(self):
        app_access.get_session_key = lambda req: None

        handler = app_access.AppAccessApp()
        response = handler.handle('')

        self.assertEqual(response['status'], 401)
        self.assertIn('Missing session key', response['payload'])

    def test_handle_missing_session_key_returns_unauthorized(self):
        app_access.get_session_key = lambda req: None

        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "GET", "path_info": "/services/app_api/ping"}')

        self.assertEqual(response['status'], 401)
        self.assertIn('Missing session key', response['payload'])

    def test_handle_unknown_path_returns_not_found(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "GET", "path_info": "/services/app_api/unknown"}')

        self.assertEqual(response['status'], 404)
        self.assertIn('Unknown path', response['payload'])

    def test_handle_missing_path_info_returns_not_found(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{"method": "GET"}')

        self.assertEqual(response['status'], 404)
        self.assertIn('Unknown path', response['payload'])

    def test_handle_malformed_json_returns_server_error(self):
        handler = app_access.AppAccessApp()
        response = handler.handle('{bad json')

        self.assertEqual(response['status'], 500)
        self.assertIn('Expecting property name enclosed in double quotes', response['payload'])


if __name__ == '__main__':
    unittest.main()