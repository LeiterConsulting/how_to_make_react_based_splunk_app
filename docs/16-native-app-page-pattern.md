# Native App Page Pattern (Architecture Choice)

Use this guide when choosing between a dashboard XML host page and a native Splunk app page for React mounting.

## Route model (must be explicit)

- Launcher route space (tile-compatible): `/app/<appId>/<view>`
- Controller route space (non-launcher): `/custom/<appId>/<controller>/...`

These are not interchangeable.

## Terminology

- `launcher-native-view`: app tile opens a real view route (`/app/<appId>/home`) and React mounts in that host view.
- `controller-native-surface`: controller-only page under `/custom/...`; usable via explicit links, not launcher tiles.

Do not label dashboard redirect shims as `native-first`.

## Decision criteria

Choose `launcher-native-view` when:

- app tile launch reliability is required,
- you want native app shell behavior without redirect shims,
- you want a stable host view (`home.xml`) for React mounting.

Choose `dashboard-wrapper` when:

- you need quick compatibility with existing SimpleXML flow,
- dashboard chrome behavior is acceptable or intentionally used,
- host behavior parity with existing dashboard-based apps is required.

Choose `controller-native-surface` when:

- you need explicit `/custom/...` entry points for specialized pages,
- you do not require launcher tile to land directly on controller path,
- you will provide explicit route links and documentation.

Controller-native claims require feasibility classification from `docs/18-native-feasibility-check.md`.

## Canonical folder/file map (native host)

- app host route: `splunk_app/<appId>/default/data/ui/nav/default.xml` (links app page)
- app host view/page asset reference: app page/view host under `default/data/ui/views/` or app-page route config
- frontend mount entry: `src/splunk/splunkMain.tsx`
- app shell component: `src/App.tsx`
- app stylesheet: `src/styles.css` -> synced bundle in `appserver/static/<appId>.css`
- backend persistent handler: `splunk_app/<appId>/bin/app_access.py`
- controller compatibility path: `splunk_app/<appId>/appserver/controllers/app_rest_proxy.py`
- route registration: `splunk_app/<appId>/default/restmap.conf`
- web exposure: `splunk_app/<appId>/default/web.conf`

## 3-layer interplay (host mode independent)

1. UI shell (dashboard-wrapper or native-app-page)
2. controller compatibility route (`app_rest_proxy` / `apprestproxy`)
3. persistent REST handler (`restmap.conf`)

Host mode changes where the UI mounts, not the backend route contract.

## Migration checklist (dashboard -> launcher-native-view)

1. Declare target host mode in handoff: `Host Mode: launcher-native-view`.
2. Set `default/app.conf` -> `default_view = home`.
3. Ensure `default/data/ui/nav/default.xml` uses `<view name="home" default="true"/>`.
4. Ensure `default/data/ui/views/home.xml` exists and mounts React root directly.
3. Keep backend routes unchanged unless explicitly required.
4. Re-validate web exposure and auth/session behavior.
5. Re-run package + smoke tests.

## Smoke checks for native host mode

- app page route resolves with authenticated session.
- React root mounts without dashboard wrapper regressions.
- app tile does not fall back to `/app/<appId>/alerts`.
- fallback API path behavior unchanged.
- full-page shell behavior (`100dvh`, internal scroll) remains stable.
- route/controller/persistent handler roundtrip succeeds.
