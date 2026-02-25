# Bootstrap Feedback: Remove Capability/Terminal Scaffold Leakage (2026-02-25)

## Why this note exists

During `dave` implementation, capability-oriented scaffold pieces (`User`, `Required capability`, `Access`, `Status`, and `app_remote_access`) influenced app behavior and UX even though they were not part of requested domain logic.

## Origin mapping (where each element came from)

### Overview header cards (`User`, `Required capability`, `Access`, `Status`)

These are from app source code, not from docs content:

- `src/App.tsx`
  - card labels rendered directly in UI
  - values bound to `capability` and `status` state

Related client/source path:

- `src/appClient.ts`
  - `getCapability()` call to `/capability`

### `app_remote_access` requirement and auth gating

This is defined in bootstrap source/config + backend defaults:

- `splunk_app/dave/default/authorize.conf`
  - defines `[capability::app_remote_access]`
- `splunk_app/dave/default/app_settings.conf`
  - `required_capability = app_remote_access`
- `splunk_app/dave/bin/app_access.py`
  - `DEFAULT_REQUIRED_CAPABILITY = 'app_remote_access'`
  - `/capability` response includes required capability + access
  - non-capability requests return 403 when capability is missing

### Why it feels like latent/legacy behavior

The roadmap confirms prior terminal-app ancestry:

- `docs/06-agent-roadmap.md`
  - migration note references old `splunk_terminal_app` origin

Additional naming residue:

- `vite.splunk.config.ts`
  - `name: 'SplunkTerminalApp'`

## Docs vs source determination

- The **UI labels** in question are **source-defined**, not documentation-driven.
- The **capability requirement pattern** is intentionally present in docs and source, but may be unsuitable as default behavior for all generated apps.

## Removal candidates for bootstrap (recommended)

### 1) Remove capability cards from default starter UI

Target files:

- `starter_variants/minimal-ui/src/App.tsx`
- `starter_variants/rich-ui/src/App.tsx`
- `src/App.tsx` (if template ships concrete UI)

Action:

- remove `User`, `Required capability`, `Access`, `Status` cards from default scaffold
- keep them only in an optional diagnostics page/variant

### 2) Make capability gating opt-in, not default-on

Target files:

- `splunk_app/<appId>/default/app_settings.conf`
- `splunk_app/<appId>/default/authorize.conf`
- `splunk_app/<appId>/bin/app_access.py`

Action:

- stop defaulting `required_capability` to `app_remote_access`
- if unset, allow app logic to run without capability gate
- move capability checks behind explicit feature flag/setting

### 3) Remove mandatory `/capability` dependency from frontend bootstrap

Target files:

- `src/appClient.ts`
- starter variant `App.tsx` files

Action:

- do not call `/capability` during base app load
- only call capability endpoint in explicit diagnostics/admin workflow

### 4) De-terminalize remaining naming

Target files:

- `vite.splunk.config.ts`

Action:

- change `name: 'SplunkTerminalApp'` to a neutral constant (e.g., `SplunkReactApp`)

### 5) Clarify docs to prevent accidental carry-over

Target files:

- `docs/04-rapid-prototype-checklist.md`
- `docs/07-agent-runbook.md`

Action:

- mark capability gate as optional by default
- add guidance: enable only if app domain explicitly needs role-based access control

## Suggested acceptance criteria for bootstrap fix

- New app generated from template runs without capability config changes.
- Default UI contains no capability/access status cards.
- `/capability` endpoint exists only as optional diagnostics behavior.
- No terminal-specific naming remains in frontend build config.
