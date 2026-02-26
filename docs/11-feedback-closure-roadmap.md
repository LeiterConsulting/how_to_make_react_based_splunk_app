# Feedback Closure Roadmap (with Success Criteria)

This roadmap converts the extensive checklist feedback into a prioritized execution plan that implementation agents can run against.

## Objective

Close remaining bootstrap gaps while keeping the template neutral, reproducible, and Splunk-compatible.

## Program success criteria

- **SC1 Packaging reliability:** `npm run package:splunk` succeeds with no manual file copy in 95%+ of rounds.
- **SC2 Identity integrity:** `npm run sanity:appid` passes for every generated app before packaging.
- **SC3 Runtime readiness:** app mounts and completes one UI -> backend roundtrip in clean Splunk smoke tests for 90%+ rounds.
- **SC4 Diagnostics quality:** route/path failures include attempted paths or diagnostics payload in 100% of failures.
- **SC5 Checklist closure:** all mandatory checklist sections (1-11) are either implemented or explicitly marked deferred with rationale.

## Phase plan

### Phase 1 (Now) — Foundations

Scope:
- Add KV collection scaffold and explicit ACL metadata stanza.
- Add diagnostics endpoint for app route introspection.

Done criteria:
- `default/collections.conf` exists with starter owner-scoped preference collection.
- `metadata/default.meta` has explicit `[collections/<name>]` ACL stanza.
- `/app_api/diagnostics` and `/<appId>/app_api/diagnostics` are callable via `restmap.conf`.

Status:
- **Started and implemented in this round.**

### Phase 2 — Stateful UX reliability patterns

Scope:
- Add server-side suppression/filter controls for non-user-usable platform entries.
- Define and persist user default selection/state with deterministic fallback behavior.

Done criteria:
- Settings are read from app conf and applied server-side.
- API contracts return explicit default-selection state (field name can vary by app domain).
- Initial load applies documented fallback semantics when persisted state no longer exists.

### Phase 3 — Write-safety contracts

Scope:
- Normalize config/KV write behavior and response envelopes.
- Ensure explicit method/content-type handling and fallback write strategies.

Done criteria:
- Reserved field collisions avoided in config writes.
- Create/update conflict handling deterministic.
- KV writes use explicit JSON semantics with normalized saved-count responses.

### Phase 4 — UI robustness and docs completion

Scope:
- Sidebar/icon resilience polish (layout overflow + icon fallback chain).
- Finalize docs and validation evidence bundle.

Done criteria:
- Narrow sidebar does not overlap controls.
- Icon fallback chain resolves safely.
- Smoke-test and runbook include updated verification points.

## Execution model for agents

1. Start from `docs/09-agent-test-round.md`.
2. Follow `docs/07-agent-runbook.md` sequence exactly.
3. Validate against `docs/08-smoke-test.md`.
4. Record closure status against this roadmap per phase.

## Current round acceptance gate

A round is accepted only if all pass:
- `npm run sanity:appid`
- `npm run package:splunk`
- diagnostics route registered and reachable by config
- no new regressions in existing app_api routes
