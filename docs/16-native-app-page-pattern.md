# Native App Page Pattern (Architecture Choice)

Use this guide when choosing between a dashboard XML host page and a native Splunk app page for React mounting.

## Decision criteria

Choose `dashboard-wrapper` when:

- you need quick compatibility with existing SimpleXML flow,
- dashboard chrome behavior is acceptable or intentionally used,
- host behavior parity with existing dashboard-based apps is required.

Choose `native-app-page` when:

- you need stricter control of full-page UX shell behavior,
- you need cleaner host boundaries with fewer dashboard wrapper side effects,
- you want architecture aligned to app-page-first frontend ownership.

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

## Migration checklist (dashboard -> native)

1. Declare target host mode in handoff: `Host Mode: native-app-page`.
2. Move React mount ownership to native page host while preserving asset names.
3. Keep backend routes unchanged unless explicitly required.
4. Re-validate web exposure and auth/session behavior.
5. Re-run package + smoke tests.

## Smoke checks for native host mode

- app page route resolves with authenticated session.
- React root mounts without dashboard wrapper regressions.
- fallback API path behavior unchanged.
- full-page shell behavior (`100dvh`, internal scroll) remains stable.
- route/controller/persistent handler roundtrip succeeds.
