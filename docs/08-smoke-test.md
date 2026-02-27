# Smoke Test (Clean Splunk Instance)

Use this checklist after generating a new app package from this template.

## Preconditions

- Clean or known-good Splunk test instance.
- Generated package available at `build/<appId>.tar.gz`.
- App was renamed to target `appId`/`appLabel` before packaging.

## 1) Build/package verification

Run:

```bash
npm install
npm run sanity:appid -- --appId <appId>
npm run build:splunk
npm run package:splunk
```

Pass criteria:

- `build/<appId>.tar.gz` exists.
- No build-time errors in JS/CSS output.

## 2) Install and restart

Steps:

1. Install tarball in Splunk Apps UI.
2. Restart Splunk.
3. Open the app from launcher.

Pass criteria:

- App appears in launcher with expected label.
- Dashboard/view mounts without blank screen.
- Launcher route resolves to host page (`/app/<appId>/home`).
- Host shell behavior is recorded as observed evidence (`dashboard-wrapper` or `non-wrapper`).
- Launcher does not fall back to `/app/<appId>/alerts`.

## 2b) Native-page objective gate (required when native page is claimed)

Checks:

- Verify whether `/app/<appId>/home/edit` exists.
- Check for dashboard controls (`Edit`, `Export`, panel edit UI).
- Check for dashboard custom-script warning banner.
- If native page is explicitly claimed, verify `/custom/<appId>/app_page` (or target custom route) is reachable and mounts React root.

Pass criteria:

- If any indicator is present, classify shell as `dashboard-wrapper` and mark native-page objective `FAIL`.
- Only classify native-page objective `PASS` when custom-route runtime evidence is confirmed and dashboard-wrapper indicators are absent on claimed native surface.

## 2c) Controller-native 404 remediation (optional; use only when tested)

If `/custom/<appId>/app_page` returns `404`, run this remediation sequence:

1. Verify route exposure in `default/web.conf` (`[expose:app_page]` and `pattern = app_page`).
2. Verify controller file exists at `appserver/controllers/app_page.py` and appId tokens are correct.
3. Verify package install/restart occurred after latest build.
4. Capture `btool web` output and browser network details for the failed `/custom` call.
5. Classify round as:
  - launcher host status: `pass` (if `/app/<appId>/home` works),
  - controller-native status: `fail (404)`,
  - native-page objective: `FAIL`.

## 3) Static asset health

Checks:

- Browser devtools network tab while loading app.
- Validate these paths resolve:
  - `appserver/static/*.js`
  - `appserver/static/*.css`
  - `static/appLogo.png`

Pass criteria:

- No unresolved 404 for primary app assets.

## 4) Route and proxy health

Validate endpoint behavior via UI action or direct call path checks.

Expected path strategy:

1. `splunkd/__raw/servicesNS/nobody/<appId>/app_api/...`
2. `splunkd/__raw/servicesNS/nobody/<appId>/<appId>/app_api/...` (if used)
3. `splunkd/__raw/services/app_api/...`
4. `splunkd/__raw/services/<appId>/app_api/...` (if used)
5. custom controller route (`/custom/<appId>/app_rest_proxy/...`)

Pass criteria:

- At least one expected route path returns successful response for core endpoint.
- Failure responses include attempted paths and structured error context.

## 4c) Custom-controller feasibility gate (optional unless controller-native is claimed)

Run both tests:

1. control route test: verify known controller path resolves (for example `/custom/<appId>/apprestproxy/ping`)
2. target route test: verify intended `/custom/<appId>/<controller>/...` route resolves

Classification output (required):

- `custom-controller available`
- `custom-controller unavailable`

Pass criteria:

- Classification is explicitly recorded.
- If classification is unavailable, architecture must pivot to `launcher-native-view` and report limitation.

## 4b) API-shape compliance gate (required)

Verify first attempted path/method/payload uses canonical shape for each operation type:

- index enumeration: `GET /services/data/indexes?output_mode=json&count=0`
- KV state base path: `/servicesNS/nobody/<appId>/storage/collections/...`
- JSON writes use canonical transport order (`postargs.__json` -> `jsonargs` -> raw JSON)

Pass criteria:

- First attempt matches canonical shape.
- Any deviation includes documented runtime rationale and fail-fast diagnostics.
- Round fails if first attempted path deviates without rationale.

## 5) Backend auth/capability behavior

Checks:

- Execute one call with valid user/capabilities.
- Execute one call that should be denied (if safe in test env).

Pass criteria:

- Allowed call succeeds with normalized JSON payload.
- Denied call returns correct status + structured JSON error.

## 5b) Runtime mutation checks (required)

Run at least one mutation cycle for each category in live Splunk runtime:

1. Config mutation
  - one create/update request (for example: profile/config upsert)
2. KV mutation
  - one KV save/write request
3. KV readback
  - one KV get/read request for just-written key

Capture requirements:

- request payload shape used,
- response status code,
- response envelope body,
- fallback path attempted (if request failed).

Pass criteria:

- All three mutation categories succeed with normalized envelopes.
- No parser/transport failures from envelope shape variation (`payload`, `body`, `query`, `form`, `postargs`, nested `__json`).

## 6) Optional server-side diagnostics

If CLI access is available, run:

```bash
splunk cmd btool restmap list --debug | egrep "app_access|<appId>"
splunk cmd btool web list --debug | egrep "app_rest_proxy|apprestproxy|<appId>"
```

Pass criteria:

- Expected restmap and web exposure entries appear.

## Result format (recommended)

Record result as:

- **PASS** or **FAIL** for each section (1-6)
- host mode declaration: `Host Mode: launcher-native-view` | `controller-native-surface`
- launcher host status: `pass` | `fail`
- controller-native status: `pass` | `fail` | `not-tested`
- shell evidence declaration: `Shell: dashboard-wrapper` | `non-wrapper`
- native-page objective: `PASS` | `FAIL`
- native feasibility classification: `custom-controller available` | `custom-controller unavailable` | `not-tested`
- evidence links:
  - launcher route evidence (`/app/<appId>/home`)
  - controller-native route evidence (`/custom/<appId>/app_page` or tested custom path, when tested)
- failing request/command details (if any)
- suspected root cause file(s)
- remediation patch summary

Failure record template (required when any check fails):

- gate name
- failing command/request
- attempted paths (if applicable)
- root-cause file(s)
- minimal patch plan (1-3 changes)

## Minimum release bar

Before publishing template or generated app changes:

- Sections 1-5, 4b, and 5b must pass.
- Section 4c is required only when controller-native route claims are made.
- Section 6 is strongly recommended when infrastructure access permits.
