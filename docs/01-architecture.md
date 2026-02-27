# Architecture

This starter uses a 3-layer architecture:

1. React UI (Vite bundle)
2. Splunk Web controller proxy (optional compatibility layer)
3. Splunk persistent REST handler (splunkd)

Launcher baseline (Splunk 10):

- App tile launch target is view-backed `/app/<appId>/home`.
- React mounts directly in `home.xml`.

## Request paths

Primary UI path order (recommended):

1. `/en-US/splunkd/__raw/servicesNS/nobody/<appId>/app_api/<endpoint>`
2. `/en-US/splunkd/__raw/services/<appId>/app_api/<endpoint>`
3. `/en-US/custom/<appId>/app_rest_proxy/services/<appId>/app_api/<endpoint>` (only when controller route is runtime-available)

Controller route is treated as runtime-qualified compatibility path, not a guaranteed launch/runtime dependency.

## Why this pattern

- Persistent REST in splunkd keeps backend logic and capability checks centralized.
- Client fallback protects from environment-specific path quirks.
- Launcher-native host keeps tile startup deterministic for Splunk 10.
