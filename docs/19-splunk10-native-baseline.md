# Splunk 10 Controller-Native Baseline (Deterministic)

This document defines the required base architecture for this repository going forward.

## Scope

- Target platform: Splunk Enterprise 10.x
- 9.x compatibility is not a goal for this baseline.
- Deliverable goal: installable, repeatable app packages that launch into an app-owned React host view.

## Baseline definition (for this repo)

Deterministic baseline means:

1. App tile launches into app-owned bridge route: `/app/<appId>/home`
2. `home.xml` immediately redirects to `/custom/<appId>/app_page`
3. Runtime UI mounts on controller-native surface (`/custom/...`) instead of SimpleXML host
4. Backend behavior is owned by persistent REST + controller compatibility path

This baseline requires controller-native runtime delivery.

## Deterministic architecture contract

Required files/config:

- `default/app.conf` contains `default_view = home`
- `default/data/ui/nav/default.xml` contains `<view name="home" default="true"/>`
- `default/data/ui/views/home.xml` exists and redirects to `/custom/<appId>/app_page`
- `appserver/controllers/app_page.py` exists and serves HTML with `splunk-react-app-root` mount

Required route model:

- Launcher bridge route: `/app/<appId>/home`
- Controller-native route: `/custom/<appId>/app_page`
- Persistent REST: `/.../app_api/...` via `restmap.conf`
- Controller compatibility route: `/custom/<appId>/app_rest_proxy/...` (runtime-dependent)

## Runtime feasibility rule

Controller-native surfaces are optional and must be runtime-qualified first.

Required output for every run:

- `custom-controller available` **or** `custom-controller unavailable`

If unavailable, mark round as failed for native-page objective and stop claiming native delivery.

Required host evidence for every run:

- observed launch URL
- observed host mode (`launcher-bridge` or `controller-native-surface`)
- observed shell behavior (`dashboard-wrapper` or `non-wrapper`)

Native-page objective classification rule:

- If dashboard indicators are present (for example `/home/edit`, `Edit`, `Export`, panel-edit controls, or dashboard custom-script warning), classify result as `dashboard-wrapper` and mark native-page objective as `not satisfied`.

## Required acceptance gates

1. `npm run sanity:appid`
2. `npm run package:splunk`
3. Launcher route validation:
   - app tile lands on `/app/<appId>/home`
   - not `/app/<appId>/alerts`
   - launcher route redirects to `/custom/<appId>/app_page`
4. API-shape compliance gate (canonical first attempt)
5. Runtime mutation checks (config upsert + KV save + KV readback)
6. Controller feasibility classification recorded
7. Host evidence recorded (launch URL + host mode + shell behavior)

## Deterministic fallback policy

If controller-native app page cannot be validated in runtime:

- fail native-page objective for the round,
- continue using persistent REST path model for diagnostics only,
- do not classify output as native.
