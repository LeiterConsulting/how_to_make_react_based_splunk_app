APP = 'splunk_react_app'
DEFAULT_UI_FRAMEWORK = 'splunk-ui-react'
DEFAULT_PRIMARY_DOCS = ['docs/01-architecture.md', 'docs/09-agent-test-round.md']
DEFAULT_NEXT_STEPS = [
    'Attach chat.md to the IDE chat session.',
    'Run npm run template:rename -- --appId <app_id> --appLabel "<App Label>".',
    'Implement the domain workflow in src/App.tsx and add matching REST endpoints only when needed.',
    'Validate with npm run validate, then package with npm run package:splunk.',
]

KNOWN_APP_API_PATHS = [
    '/servicesNS/nobody/{}/app_api/ping'.format(APP),
    '/servicesNS/nobody/{}/app_api/bootstrap'.format(APP),
    '/servicesNS/nobody/{}/app_api/diagnostics'.format(APP),
    '/services/app_api/ping',
    '/services/app_api/bootstrap',
    '/services/app_api/diagnostics',
]


def split_csv(raw):
    if raw is None:
        return []
    return [item.strip() for item in str(raw).split(',') if item.strip()]


def build_bootstrap_payload(path, method, settings, user, has_access):
    preferred_ui_framework = str(settings.get('preferred_ui_framework') or DEFAULT_UI_FRAMEWORK).strip() or DEFAULT_UI_FRAMEWORK
    primary_docs = split_csv(settings.get('primary_docs')) or DEFAULT_PRIMARY_DOCS
    next_steps = split_csv(settings.get('starter_next_steps')) or DEFAULT_NEXT_STEPS

    return {
        'ok': True,
        'app': {
            'id': APP,
            'host_view': 'home',
            'preferred_ui_framework': preferred_ui_framework,
        },
        'agent_context': {
            'chat_context_file': str(settings.get('chat_context_file') or 'chat.md').strip(),
            'workspace_instructions_file': str(settings.get('workspace_instructions_file') or '.github/copilot-instructions.md').strip(),
            'prompt_file': str(settings.get('prompt_file') or '.github/prompts/build-splunk-app.prompt.md').strip(),
            'primary_docs': primary_docs,
        },
        'user_context': {
            'user': user,
            'required_capability': str(settings.get('required_capability') or '').strip(),
            'has_access': has_access,
        },
        'request_context': {
            'path': path,
            'method': method,
        },
        'next_steps': next_steps,
    }


def build_diagnostics_payload(path, method, required_capability, has_access, preferred_ui_framework):
    return {
        'ok': True,
        'component': 'app_access',
        'app': APP,
        'path': path,
        'method': method,
        'required_capability': required_capability,
        'has_access': has_access,
        'known_app_api_paths': KNOWN_APP_API_PATHS,
        'custom_controller_path': '/custom/{}/app_rest_proxy/services/{}/app_api'.format(APP, APP),
        'preferred_ui_framework': preferred_ui_framework,
    }