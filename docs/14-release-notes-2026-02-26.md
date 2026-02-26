# Release Notes — 2026-02-26

## Summary

This release hardens the bootstrap into a doc-grounded, resilience-first agent build system.

## Key additions

- Agent source-routing policy for official-doc-grounded decisions.
- SDK/API surface selection matrix for implementation boundaries.
- Updated runbook and test prompt contracts requiring explicit API surface rationale.
- Route fallback guidance aligned to direct `splunkd/__raw/services*` first, then controller compatibility path.
- Chrome/full-page guidance expanded with `100dvh` + internal-region scrolling baseline.
- Roadmap success criteria expanded for mutation transport resilience.
- Smoke test expanded with required runtime mutation checks:
  - config upsert,
  - KV save,
  - KV readback,
  with payload/response evidence capture and failure template.

## Why this matters

- Reduces agent drift from official Splunk APIs.
- Increases reliability under Splunk runtime request/transport variability.
- Turns stress-test findings into repeatable acceptance gates.

## New/updated guidance entry points

- `docs/12-agent-source-routing-policy.md`
- `docs/13-sdk-api-selection-matrix.md`
- `docs/07-agent-runbook.md`
- `docs/08-smoke-test.md`
- `docs/09-agent-test-round.md`
- `docs/10-dashboard-chrome-controls.md`
- `docs/11-feedback-closure-roadmap.md`

## Validation baseline

Use these as minimum publish gates:

- `npm run sanity:appid`
- `npm run package:splunk`
- runtime mutation checks in live Splunk (config upsert + KV save + KV get)
