try:
  import cherrypy
except Exception:
  cherrypy = None

try:
  from splunk.appserver.mrsparkle.controllers import BaseController
except Exception:
  BaseController = object

try:
  from splunk.appserver.mrsparkle.lib.decorators import expose_page
except Exception:
  def expose_page(*_args, **_kwargs):
    def _wrap(fn):
      return fn
    return _wrap

APP = 'splunk_react_app'


def _static_asset(path):
  return f'/static/app/{APP}/{path}'


def _html_page():
  css_href = _static_asset(f'{APP}.css')
  js_src = _static_asset(f'{APP}.js')
  return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{APP}</title>
  <link rel="stylesheet" href="{css_href}" />
  <style>
    html, body, #splunk-react-app-root {{
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #0f1720;
    }}
  </style>
</head>
<body>
  <div id="splunk-react-app-root"></div>
  <script src="{js_src}"></script>
</body>
</html>'''


class AppPageController(BaseController):
  @expose_page(must_login=True, methods=['GET'])
  def index(self, **_kwargs):
    if cherrypy is not None:
      cherrypy.response.headers['Content-Type'] = 'text/html; charset=utf-8'
      cherrypy.response.headers['Cache-Control'] = 'no-store'
    return _html_page()
