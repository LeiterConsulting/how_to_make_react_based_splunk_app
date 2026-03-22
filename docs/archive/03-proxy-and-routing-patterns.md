# Proxy + Routing Patterns

## Persistent REST (`restmap.conf`)

- Use explicit endpoint matches for critical paths.
- Keep `script`, `handler`, `handlertype`, `scripttype`, `requireAuthentication` set.

## Web exposure (`web.conf`)

Expose both controller spellings for compatibility:

- `app_rest_proxy/*`
- `apprestproxy/*`

Also expose app-scoped service patterns where needed.

## Controller proxy (`appserver/controllers`)

- Read session key from CherryPy session.
- Proxy only allowlisted paths for your app ID.
- Forward method + params/body to `splunk.rest.simpleRequest`.

## Frontend fallback

The client should prefer direct `splunkd/__raw/services*` app routes first, then custom controller proxy.

Recommended order:

1. `splunkd/__raw/servicesNS/nobody/<appId>/app_api/...`
2. `splunkd/__raw/servicesNS/nobody/<appId>/<appId>/app_api/...` (if used)
3. `splunkd/__raw/services/app_api/...`
4. `splunkd/__raw/services/<appId>/app_api/...` (if used)
5. `/custom/<appId>/app_rest_proxy/services/<appId>/app_api/...`

This improves portability across Splunk versions/environments.
