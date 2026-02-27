# Agent Runbook (Generate Bespoke Splunk App)

This runbook defines the exact sequence an agent should execute to turn a new app request into an installable Splunk package.

## Inputs required from user

- `appId` (lowercase, underscore-safe; example: `threat_ops_console`)
- `appLabel` (launcher/display name)
- target backend capability requirement(s), if needed
- core endpoint set needed by UI
- preferred UI variant (`minimal` or `rich`)
- dashboard chrome policy (`suppress-actions` default, `default`, or `custom`)
- host mode (`launcher-native-view` default | `controller-native-surface` optional)
- deployment shape under test (`standalone` | `distributed` | `search-head-cluster`)

Use `docs/11-feedback-closure-roadmap.md` as the checklist-closure target when prioritizing implementation gaps.
Use `docs/12-agent-source-routing-policy.md` and `docs/13-sdk-api-selection-matrix.md` to choose official SDK/API surfaces before implementation.
Use `docs/16-native-app-page-pattern.md` to declare host mode early, `docs/18-native-feasibility-check.md` for runtime classification, and `docs/17-splunk-runtime-variance.md` for runtime adaptation rules.
Use `docs/19-splunk10-native-baseline.md` as the required launcher-view architecture baseline.
Use `docs/20-fact-evidence-standard.md` to classify guidance claims as documentation fact, runtime fact, or policy rule.
Use `docs/21-supported-app-reliability-cues.md` to enforce adopted reliability defaults.
Use `docs/23-controller-native-option.md` when (and only when) controller-native route delivery is explicitly requested.

## Canonical API shape requirements (first attempt)

- Index enumeration: `GET /services/data/indexes?output_mode=json&count=0`
- KV base path shape: `/servicesNS/nobody/<appId>/storage/collections/...`
- JSON write transport order:
   1. `postargs.__json`
   2. `jsonargs`
   3. raw JSON with explicit `Content-Type: application/json`

No speculative endpoint/path shapes are allowed as first attempt. If runtime variance requires deviation, fail fast with structured diagnostics and include rationale.

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

4. **Apply chrome policy (required default)**
   - Follow `docs/10-dashboard-chrome-controls.md`.
   - Keep suppression/modification scoped to requested view only.
   - Maintain `hideEdit=true` on launcher/fallback views unless explicitly overridden.

5. **Implement backend domain logic**
   - Replace logic in persistent REST handler under `splunk_app/<appId>/bin/*.py`.
   - Keep structured JSON error payloads and enable capability checks only when required by app domain.
   - Preserve session/auth extraction robustness.
   - For rich variants, include a collapsed-by-default backend debug panel fed by standardized debug fields:
     - `attempted_paths`
     - `attempted_transports`
     - `transport_errors`
     - source summary (`sources`, `errors`, `count`)

6. **Validate routing and exposure contracts**
   - Confirm endpoint matches in `default/restmap.conf`.
   - Confirm controller exposure in `default/web.conf` for both:
     - `app_rest_proxy/*`
     - `apprestproxy/*`
   - Ensure app-scoped endpoint patterns used by UI are exposed and authenticated.

7. **Validate host-mode contract**
   - `launcher-native-view`: launcher route must resolve via `/app/<appId>/home` with real `home.xml` host.
   - `controller-native-surface`: runtime route may resolve under `/custom/<appId>/...` only when explicitly requested and runtime-qualified.
   - host-shell rendering must be reported as observed evidence (`dashboard-wrapper` or `non-wrapper`), not inferred from route naming.

8. **Run native feasibility classification (required for controller-native claims)**
   - Execute control route test and target route test per `docs/18-native-feasibility-check.md`.
   - Record one classification exactly:
     - `custom-controller available`
     - `custom-controller unavailable`
   - If unavailable, keep launcher-native-view baseline and declare limitation explicitly.
   - If controller-native is not claimed in this round, mark controller checks as `not-tested`.

9. **Build and package**
   - `npm run build:splunk`
   - `npm run package:splunk`
   - Confirm output exists: `build/<appId>.tar.gz`

10. **Install and runtime validate (Splunk test instance)**
   - Install tarball in Splunk Apps UI.
   - Restart Splunk.
   - Open app dashboard and verify mount.
   - Verify one successful UI -> backend roundtrip.
   - For capability-heavy rounds, execute runtime mutation checks (config upsert + KV save + KV get) and capture payload/response evidence.

## Required artifacts for handoff

- Installable package: `build/<appId>.tar.gz`
- Host mode declaration with rationale: `launcher-native-view` | `controller-native-surface`.
- Deployment shape declaration: `standalone` | `distributed` | `search-head-cluster`.
- Native feasibility classification: `custom-controller available` | `custom-controller unavailable`.
- Native feasibility classification may be `not-tested` when controller-native is out of scope for the round.
- Shell evidence declaration: `dashboard-wrapper` | `non-wrapper`.
- Native-page objective verdict: `PASS` | `FAIL`.
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
- **Contrast gate:** launcher host view passes contrast/readability checks with visible keyboard focus states.

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
