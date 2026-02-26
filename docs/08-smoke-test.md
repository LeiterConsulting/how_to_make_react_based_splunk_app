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

## 5) Backend auth/capability behavior

Checks:

- Execute one call with valid user/capabilities.
- Execute one call that should be denied (if safe in test env).

Pass criteria:

- Allowed call succeeds with normalized JSON payload.
- Denied call returns correct status + structured JSON error.

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
- failing request/command details (if any)
- suspected root cause file(s)
- remediation patch summary

## Minimum release bar

Before publishing template or generated app changes:

- Sections 1-5 must pass.
- Section 6 is strongly recommended when infrastructure access permits.
