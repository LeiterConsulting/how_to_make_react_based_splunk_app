# Native App Page Pattern (Architecture Choice)

Use this guide when choosing between launcher-bridge and controller-native-surface patterns for React mounting.

## Route model (must be explicit)

- Launcher route space (tile-compatible): `/app/<appId>/<view>`
- Controller route space (non-launcher): `/custom/<appId>/<controller>/...`

These are not interchangeable.

## Terminology

- `launcher-bridge`: app tile opens a real view route (`/app/<appId>/home`) that immediately redirects to `/custom/<appId>/app_page`.
- `controller-native-surface`: controller-only page under `/custom/...`; usable via explicit links, not launcher tiles.

`launcher-bridge` is a launcher compatibility path only; runtime UI should be delivered from controller-native surface.

Do not label dashboard redirect shims as `native-first`.

## Decision criteria

Use `launcher-bridge` when app-tile entry is required, but keep runtime target as `/custom/<appId>/app_page`.

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

1. UI shell (`launcher-bridge` -> `controller-native-surface`)
2. controller compatibility route (`app_rest_proxy` / `apprestproxy`)
3. persistent REST handler (`restmap.conf`)

Host mode changes where the UI mounts, not the backend route contract.

## Migration checklist (legacy host -> launcher-bridge + controller-native)

1. Declare target host mode in handoff: `Host Mode: launcher-bridge`.
2. Set `default/app.conf` -> `default_view = home`.
3. Ensure `default/data/ui/nav/default.xml` uses `<view name="home" default="true"/>`.
4. Ensure `default/data/ui/views/home.xml` exists and redirects to `/custom/<appId>/app_page`.
5. Ensure `appserver/controllers/app_page.py` serves controller-native React mount HTML.
6. Keep backend routes unchanged unless explicitly required.
7. Re-validate web exposure and auth/session behavior.
8. Re-run package + smoke tests.

## Smoke checks for native host mode

- app page route resolves with authenticated session.
- React root mounts without dashboard wrapper regressions.
- host shell classification is explicitly recorded (`dashboard-wrapper` or `non-wrapper`).
- app tile does not fall back to `/app/<appId>/alerts`.
- fallback API path behavior unchanged.
- full-page shell behavior (`100dvh`, internal scroll) remains stable.
- route/controller/persistent handler roundtrip succeeds.
