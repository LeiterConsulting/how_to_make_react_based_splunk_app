# Agent Runbook (Generate Bespoke Splunk App)

This runbook defines the exact sequence an agent should execute to turn a new app request into an installable Splunk package.

## Inputs required from user

- `appId` (lowercase, underscore-safe; example: `threat_ops_console`)
- `appLabel` (launcher/display name)
- target backend capability requirement(s), if needed
- core endpoint set needed by UI
- preferred UI variant (`minimal` or `rich`)
- dashboard chrome policy (`default`, `suppress-actions`, or `custom`)

Use `docs/11-feedback-closure-roadmap.md` as the checklist-closure target when prioritizing implementation gaps.

## Standard execution sequence

1. **Initialize workspace**
   - Change to repository root first:
     - `cd <repo-root-containing-package.json>`
   - Ensure dependencies are installed: `npm install`
   - Confirm current template builds before customization.

2. **Apply app identity**
   - Run rename utility:
     - `npm run template:rename -- --appId <appId> --appLabel "<appLabel>"`
   - Verify app identity is updated in Splunk app folder, view/nav names, and packaging/build scripts.
   - Run consistency gate:
     - `npm run sanity:appid -- --appId <appId> --appLabel "<appLabel>"`
    - Note: check count may differ by one when `--appLabel` is omitted (label assertion is optional).

3. **Select UI baseline**
   - Minimal first for fast route bring-up: `npm run variant:minimal`
   - Use rich variant when feature surface requires it: `npm run variant:rich`

4. **Apply chrome policy (if requested)**
   - Follow `docs/10-dashboard-chrome-controls.md`.
   - Keep suppression/modification scoped to requested view only.

5. **Implement backend domain logic**
   - Replace logic in persistent REST handler under `splunk_app/<appId>/bin/*.py`.
   - Keep structured JSON error payloads and enable capability checks only when required by app domain.
   - Preserve session/auth extraction robustness.

6. **Validate routing and exposure contracts**
   - Confirm endpoint matches in `default/restmap.conf`.
   - Confirm controller exposure in `default/web.conf` for both:
     - `app_rest_proxy/*`
     - `apprestproxy/*`
   - Ensure app-scoped endpoint patterns used by UI are exposed and authenticated.

7. **Build and package**
   - `npm run build:splunk`
   - `npm run package:splunk`
   - Confirm output exists: `build/<appId>.tar.gz`

8. **Install and runtime validate (Splunk test instance)**
   - Install tarball in Splunk Apps UI.
   - Restart Splunk.
   - Open app dashboard and verify mount.
   - Verify one successful UI -> backend roundtrip.

## Required artifacts for handoff

- Installable package: `build/<appId>.tar.gz`
- Brief validation report containing:
  - build/package command outputs
  - route verification notes (or `btool` output)
  - screenshot(s) or logs showing dashboard mount and one backend success
- Updated docs when architecture or route contracts changed.

## Quality gates (must pass)

- **Identity gate:** `appId` consistent across all known required files.
- **Packaging gate:** `npm run package:splunk` succeeds without manual file copy.
- **Routing gate:** configured endpoints resolve for expected path variants.
- **Auth gate:** unauthorized/capability failures return structured JSON + status.
- **Asset gate:** no unresolved static 404 for app icon or app bundles.

## Failure handling protocol

When a gate fails, the agent must return:

- failed gate name
- exact command/request that failed
- attempted route paths (for network/proxy failures)
- file-level probable root cause
- minimal patch plan (1-3 changes) to recover

## Suggested prompt contract for future agents

Provide this compact contract to any implementation agent:

- Use `appId=<...>` and `appLabel=<...>` as canonical identity.
- Keep Splunk 3-layer model: UI -> controller proxy -> persistent REST.
- Do not remove fallback path strategy in frontend helper.
- Produce `build/<appId>.tar.gz` and include runtime validation evidence.
- If blocked, emit actionable diagnostics instead of generic failure text.
