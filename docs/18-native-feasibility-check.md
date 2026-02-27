# Native Feasibility Check (Required)

Use this check before claiming a `controller-native-surface` architecture.

## Purpose

Some Splunk runtimes do not expose custom controller routes even when controller code and `web.conf` patterns are present. This check prevents repeated implementation loops.

## Classification output (required)

- `custom-controller available`
- `custom-controller unavailable`

Every capability-heavy handoff must include one of these exact classifications.

## Validation sequence

1. Validate launcher route behavior
   - confirm launcher bridge route resolves: `/app/<appId>/home`
   - confirm it redirects to `/custom/<appId>/app_page`
2. Run control controller route test
   - verify a known controller path resolves (for example app proxy control route)
3. Run target controller route test
   - verify intended `/custom/<appId>/<controller>/...` route resolves

## Decision branches

### Branch A — control route fails

Classify as: `custom-controller unavailable`

Implications:

- do not pursue controller-native surface in this runtime,
- classify native objective failed for the round,
- declare non-native controller limitation in handoff.

### Branch B — control route passes, target route fails

Classify as: `custom-controller available` with app-level mismatch

Implications:

- investigate naming/exposure/controller registration mismatch,
- keep diagnostics and fix config/code before architecture claims.

### Branch C — both control and target pass

Classify as: `custom-controller available`

Implications:

- controller-native surface is feasible in this runtime,
- still keep launcher/view and controller route spaces documented separately.

## Required diagnostics payload (minimum)

- `attempted_paths`
- `attempted_methods`
- `status_codes`
- `environment_classification`
- `next_action`
