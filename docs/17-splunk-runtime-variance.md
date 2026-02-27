# Splunk Runtime Variance Appendix

This appendix captures common runtime deltas observed across Splunk environments and how agents should adapt without breaking contracts.

## 1) Index endpoint access variance

- Symptom: index enumeration returns different visibility by role/capability.
- Canonical first shape: `GET /services/data/indexes?output_mode=json&count=0`
- Guidance:
  - fail fast with structured diagnostics when access is denied,
  - include attempted path/method and auth context summary,
  - avoid speculative alternate endpoint shapes unless documented rationale is captured.

## 2) KV write transport variance

- Symptom: writes fail depending on expected transport/body format.
- Canonical write transport order:
  1. `postargs.__json`
  2. `jsonargs`
  3. raw JSON with explicit `Content-Type: application/json`
- Guidance:
  - record attempted transports and transport errors in diagnostics,
  - keep response envelope normalized regardless of transport path used.

## 3) Non-JSON empty write responses

- Symptom: write operations succeed but return empty/plain bodies.
- Guidance:
  - tolerate empty/non-JSON write bodies,
  - return normalized success envelope to UI,
  - do not fail solely due to response parse expectations.

## 4) Dashboard wrapper vs native app page variance

- Symptom: host-shell behavior, chrome controls, and scroll behavior differ by host mode.
- Guidance:
  - declare host mode in every handoff (`dashboard-wrapper` or `native-app-page`),
  - validate host-mode-specific smoke checks,
  - keep backend route contracts host-mode independent.
