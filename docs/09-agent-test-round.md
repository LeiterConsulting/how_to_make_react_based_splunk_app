# Agent Test Round (Execution Playbook)

AGENT_START_HERE: `docs/09-agent-test-round.md`

Use this playbook to run the next validation cycle with an implementation agent.

## Objective

Verify that an agent can use this bootstrap to produce a bespoke app package with minimal human intervention.

## Test input set (fill before run)

- `appId`:
- `appLabel`:
- domain summary (2-4 lines):
- required backend capability name (optional):
- core endpoints to implement:
- UI variant (`minimal` or `rich`):
- chromePolicy (`default` | `suppress-actions` | `custom`):
- chromeTargets (if non-default):

## Agent prompt (copy/paste)

```text
You are implementing a bespoke Splunk app using this repository bootstrap.

Constraints:
1) Use appId=<APP_ID> and appLabel=<APP_LABEL> as canonical identity.
2) Keep the 3-layer route model: React UI -> app_rest_proxy/apprestproxy -> persistent REST handler.
3) Keep frontend fallback path strategy and include attempted paths in failures.
4) Use existing scripts and docs in this repo, especially docs/07-agent-runbook.md and docs/08-smoke-test.md.
5) Follow docs/10-dashboard-chrome-controls.md for any chrome suppression/modification.
6) Do not add unrelated features.

Required execution sequence:
- Run rename: npm run template:rename -- --appId <APP_ID> --appLabel "<APP_LABEL>"
- Run sanity: npm run sanity:appid -- --appId <APP_ID> --appLabel "<APP_LABEL>"
- Implement requested domain changes in UI + backend.
- Build/package: npm run package:splunk
- Produce validation report with:
  - package path,
  - attempted route diagnostics for any failures,
  - checklist status mapped to docs/08-smoke-test.md.

Definition of done:
- build/<APP_ID>.tar.gz is produced
- sanity check passes
- app dashboard mounts in Splunk test instance
- one successful UI -> backend roundtrip verified
```

## Human operator steps

1. Create a clean branch for the test round.
2. Fill test input set above.
3. Launch agent with the prompt and filled values.
4. Let agent complete implementation and packaging.
5. Run smoke test from `docs/08-smoke-test.md`.
6. Record outcomes in result template below.

## Result template

- **Round ID:**
- **Date:**
- **Agent/model:**
- **PASS/FAIL:**
- **Package output:**
- **Smoke test sections passed (1-6):**
- **Primary failure (if any):**
- **Root cause file(s):**
- **Follow-up actions:**

## Pass criteria for this round

- `npm run sanity:appid` passes after agent changes.
- `npm run package:splunk` succeeds.
- Package installs and app mounts in Splunk.
- At least one backend endpoint succeeds through expected path strategy.

## Failure classification

- **Identity drift:** appId mismatch across files.
- **Packaging drift:** build/sync/tarball failures.
- **Route exposure drift:** `restmap.conf`/`web.conf` mismatch.
- **Contract drift:** malformed/non-normalized backend payloads.
- **Doc drift:** implementation differs from runbook without explicit rationale.
