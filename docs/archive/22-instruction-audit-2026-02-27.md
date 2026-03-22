# Instruction Set Audit (2026-02-27)

This audit reviews repository instruction sets against Splunk developer guidance and operational best practices for reliable agent execution.

## Scope reviewed

- `README.md`
- `docs/01-architecture.md`
- `docs/02-build-package-install.md`
- `docs/03-proxy-and-routing-patterns.md`
- `docs/04-rapid-prototype-checklist.md`
- `docs/06-agent-roadmap.md`
- `docs/07-agent-runbook.md`
- `docs/08-smoke-test.md`
- `docs/09-agent-test-round.md`
- `docs/10-dashboard-chrome-controls.md`
- `docs/12-agent-source-routing-policy.md`
- `docs/13-sdk-api-selection-matrix.md`
- `docs/16-native-app-page-pattern.md`
- `docs/17-splunk-runtime-variance.md`
- `docs/18-native-feasibility-check.md`
- `docs/19-splunk10-native-baseline.md`
- `docs/20-fact-evidence-standard.md`
- `docs/21-supported-app-reliability-cues.md`

## Reference sources

- Splunk Developer Guide (develop apps): https://dev.splunk.com/enterprise/docs/developapps/
- Extension points: https://dev.splunk.com/enterprise/docs/developapps/extensionpoints/
- Visualize data guidance: https://dev.splunk.com/enterprise/docs/developapps/visualizedata/
- SDK references (JS/Java/Python/Web Framework) as API-client references

## Findings

1. Prior contradictions existed between:
   - launcher-view deterministic route claims (`/app/<appId>/home`), and
   - controller-native required baseline claims (`/custom/...` required).
2. Splunk docs consistently frame app UI through extension points and view/nav models, while custom route surfaces are configuration/runtime dependent.
3. Reliability for agent-run generation is highest when launcher-view is deterministic baseline and controller-native claims are evidence-gated.

## Decisions applied

- Baseline host model: `launcher-native-view` on `/app/<appId>/home`.
- Controller-native surface: optional, runtime-qualified, never assumed by default.
- Native claim rule: only when controller surface is validated and non-wrapper evidence is captured.
- Chrome suppression: default `hideEdit=true` on launcher/fallback views.

## Instruction updates completed

- Replaced controller-required language with launcher-default + optional controller in runbook/smoke/test-round/native docs.
- Re-aligned README architecture summary and routing order descriptions.
- Updated source-routing policy to prioritize current Developer Guide pages for route/UI-host claims.
- Updated API-selection matrix to avoid treating custom routes as launch dependency.
- Updated checklist docs to make controller checks conditional on native claims.

## Guardrail updates completed

- `home.xml` now mounts React directly on launcher route.
- `sanity:appid` enforces launcher host mount contract by default.
- `app_page.py` checks are conditional: enforced only when file is present.

## Operational recommendation

Use this two-tier contract for all agent rounds:

1. **Deterministic delivery contract** (must pass): launcher-view route, package build, backend roundtrip, structured diagnostics.
2. **Native-surface claim contract** (conditional): controller feasibility + host evidence + explicit PASS/FAIL native objective.
