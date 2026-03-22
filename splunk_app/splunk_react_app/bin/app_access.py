import json

from splunk.persistconn.application import PersistentServerConnectionApplication
from app_access_payloads import APP, DEFAULT_UI_FRAMEWORK, build_bootstrap_payload, build_diagnostics_payload
from app_access_splunk import get_current_context, get_session_key, json_response, normalize_path, read_app_settings


class AppAccessApp(PersistentServerConnectionApplication):
    def __init__(self, command_line=None, command_arg=None):
        super(AppAccessApp, self).__init__()

    def handle(self, in_string):
        try:
            req = json.loads(in_string) if in_string else {}
            session_key = get_session_key(req)
            if not session_key:
                return json_response({'error': 'Missing session key'}, status=401)

            method = str(req.get('method') or 'GET').upper()
            path = normalize_path(req)

            settings = read_app_settings(APP, session_key)
            required_capability = str(settings.get('required_capability') or '').strip()
            preferred_ui_framework = str(settings.get('preferred_ui_framework') or DEFAULT_UI_FRAMEWORK).strip() or DEFAULT_UI_FRAMEWORK

            user, capabilities = get_current_context(session_key)
            has_access = True if not required_capability else required_capability in capabilities

            if path.endswith('/ping'):
                return json_response({'ok': True, 'app': APP, 'path': path, 'method': method})

            if path.endswith('/diagnostics'):
                return json_response(
                    build_diagnostics_payload(
                        path=path,
                        method=method,
                        required_capability=required_capability,
                        has_access=has_access,
                        preferred_ui_framework=preferred_ui_framework,
                    )
                )

            if path.endswith('/bootstrap'):
                # REVIEW: Keep this payload small and stable so IDE agents can rely on it during smoke tests.
                return json_response(build_bootstrap_payload(path, method, settings, user, has_access))

            return json_response({'error': 'Unknown path {}'.format(path)}, status=404)
        except Exception as e:
            return json_response({'error': str(e)}, status=500)
