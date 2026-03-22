import json

import splunk.rest as rest


def json_response(payload, status=200):
    return {
        'status': status,
        'payload': json.dumps(payload),
        'headers': {'Content-Type': 'application/json'},
    }


def get_session_key(req):
    sess = req.get('session', {}) if isinstance(req, dict) else {}
    if isinstance(sess, dict):
        session_key = sess.get('authtoken') or sess.get('sessionKey') or sess.get('session_key') or sess.get('splunk.sessionKey')
        if session_key and isinstance(session_key, str):
            return session_key

    for key in ('sessionKey', 'session_key'):
        value = req.get(key)
        if isinstance(value, str) and value:
            return value

    headers = req.get('headers') or {}
    if isinstance(headers, dict):
        auth = headers.get('Authorization') or headers.get('authorization') or ''
        if isinstance(auth, str) and auth.startswith('Splunk '):
            token = auth[7:].strip()
            if token:
                return token

    return None


def normalize_path(req):
    path = req.get('path_info') or req.get('path') or req.get('uri') or req.get('rest_path') or ''
    if isinstance(path, (bytes, bytearray)):
        path = path.decode('utf-8', errors='replace')
    if not isinstance(path, str):
        path = str(path)
    if '?' in path:
        path = path.split('?', 1)[0]
    return path.rstrip('/')


def simple_json(path, session_key, method='GET', getargs=None, postargs=None):
    _, content = rest.simpleRequest(
        path,
        sessionKey=session_key,
        method=method,
        getargs=getargs or {},
        postargs=postargs or {},
        raiseAllErrors=True,
    )
    body = content.decode('utf-8') if isinstance(content, (bytes, bytearray)) else str(content)
    return json.loads(body) if body else {}


def read_app_settings(app, session_key):
    try:
        data = simple_json(
            '/servicesNS/nobody/{}/configs/conf-app_settings/settings'.format(app),
            session_key,
            method='GET',
            getargs={'output_mode': 'json'},
        )
        entry = (data.get('entry') or [{}])[0]
        return entry.get('content') or {}
    except Exception:
        return {}


def get_current_context(session_key):
    data = simple_json(
        '/services/authentication/current-context',
        session_key,
        method='GET',
        getargs={'output_mode': 'json'},
    )
    entry = (data.get('entry') or [{}])[0]
    content = entry.get('content') or {}
    username = str(content.get('username') or content.get('realname') or '')

    capabilities = content.get('capabilities') or []
    if isinstance(capabilities, str):
        capabilities = [value.strip() for value in capabilities.split(',') if value.strip()]
    elif not isinstance(capabilities, list):
        capabilities = []
    return username, [str(value) for value in capabilities]