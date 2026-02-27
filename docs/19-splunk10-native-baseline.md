# Splunk 10 Launcher-View Baseline (Deterministic)

This document defines the required base architecture for this repository going forward.

## Scope

- Target platform: Splunk Enterprise 10.x
- 9.x compatibility is not a goal for this baseline.
- Deliverable goal: installable, repeatable app packages that launch into an app-owned React shell.

## Baseline definition (for this repo)

Deterministic baseline means:

1. App tile launches into app-owned host route: `/app/<appId>/home`
2. `home.xml` is a minimal React mount host (no dashboard searches or redirect shims)
3. UI behavior and rendering are owned by React app code
4. Backend behavior is owned by persistent REST + optional controller compatibility path

This baseline does **not** claim a controller-native launch surface.
This baseline also does **not** claim dashboard chrome absence; host-shell behavior is runtime-dependent and must be recorded as observed evidence.

## Deterministic architecture contract

Required files/config:

- `default/app.conf` contains `default_view = home`
- `default/data/ui/nav/default.xml` contains `<view name="home" default="true"/>`
- `default/data/ui/views/home.xml` exists and references `<appId>.js` and `<appId>.css`
- `home.xml` contains React root mount (`splunk-react-app-root`) and no search stanzas

Required route model:

- Launcher/view route: `/app/<appId>/home`
- Persistent REST: `/.../app_api/...` via `restmap.conf`
- Controller compatibility route: `/custom/<appId>/app_rest_proxy/...` (runtime-dependent)

## Runtime feasibility rule

Controller-native surfaces are optional and must be runtime-qualified first.

Required output for every run:

- `custom-controller available` **or** `custom-controller unavailable`

If unavailable:

- keep launcher-native-view architecture,
- declare controller limitation explicitly in validation report,
- do not claim controller-native capability.

Required host evidence for every run:

- observed launch URL
- observed host mode (`launcher-native-view` or `controller-native-surface`)
- observed shell behavior (`dashboard-wrapper` or `non-wrapper`)

## Required acceptance gates

1. `npm run sanity:appid`
2. `npm run package:splunk`
3. Launcher route validation:
   - app tile lands on `/app/<appId>/home`
   - not `/app/<appId>/alerts`
4. API-shape compliance gate (canonical first attempt)
5. Runtime mutation checks (config upsert + KV save + KV readback)
6. Controller feasibility classification recorded
7. Host evidence recorded (launch URL + host mode + shell behavior)

## Deterministic fallback policy

If any controller route cannot be validated in runtime:

- keep app functional on launcher-native-view host,
- continue using persistent REST path model,
- treat controller path as optional compatibility layer, not core launch dependency.
