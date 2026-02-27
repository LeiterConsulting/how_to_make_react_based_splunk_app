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
  - declare host mode in every handoff (`launcher-native-view` or `controller-native-surface`),
  - validate host-mode-specific smoke checks,
  - keep backend route contracts host-mode independent.

## 5) Native-launch failure signatures

- `404` on `/app/<appId>/home` when launcher target view is missing/invalid.
- Launcher tile fallback to `/app/<appId>/alerts` when default view/nav setup is incomplete.

Immediate triage:

1. Verify `default/app.conf` contains `default_view = home`.
2. Verify `default/data/ui/nav/default.xml` includes `<view name="home" default="true"/>`.
3. Verify `default/data/ui/views/home.xml` exists and redirects to `/custom/<appId>/app_page`.
4. Re-run `npm run sanity:appid` and smoke checks before runtime retest.

Classification requirement:

- If control controller route also fails: `custom-controller unavailable`
- If control controller route passes but target fails: `custom-controller available` with app-level mismatch
