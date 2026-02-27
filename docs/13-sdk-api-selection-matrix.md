# SDK/API Selection Matrix (Agentic Build)

Use this matrix to select the correct implementation surface before coding.

## Selection matrix

| Problem boundary | Preferred surface | Why | Typical location in this repo |
|---|---|---|---|
| Browser-to-Splunk app calls in dashboard context | Splunk Web path helpers + app REST routes | Most compatible with Splunk Web session/csrf behavior | `src/llmProxySdk/splunkFetch.ts`, `src/appClient.ts` |
| Splunk persistent backend logic | Python persistent REST handler | Native fit for `restmap.conf` + Splunk runtime | `splunk_app/<appId>/bin/*.py` |
| Splunk Web controller compatibility proxy | Splunk Web Framework controller patterns | Handles browser path compatibility in some deployments | `splunk_app/<appId>/appserver/controllers/*.py` |
| Cross-service integration from backend | Python SDK or `splunk.rest.simpleRequest` | Strongest fit to existing bootstrap runtime path | `splunk_app/<appId>/bin/*.py` |
| Enterprise service outside Splunk runtime JVM stack | Java SDK | Use when deployment architecture already centers Java services | external service layer (not bootstrap default) |
| Frontend-only data transform/UX logic | TypeScript only (no SDK) | Avoid unnecessary backend coupling | `src/*` |

## Decision heuristics

- Prefer the **smallest surface** that satisfies the requirement.
- Keep Splunk auth/session handling on server-side boundaries where possible.
- Use controller proxy as compatibility fallback, not the only route.
- For persistence and privileged actions, prefer backend endpoints over direct browser writes.
- Use canonical first-attempt API shapes before runtime-specific fallbacks.

## Canonical first-attempt API shapes

- Index enumeration:
	- `GET /services/data/indexes?output_mode=json&count=0`
- KV state persistence base path:
	- `/servicesNS/nobody/<appId>/storage/collections/...`
- JSON write transport order:
	1. `postargs.__json`
	2. `jsonargs`
	3. raw JSON with explicit `Content-Type: application/json`

No speculative endpoint shapes as first attempt. If a runtime-specific alternative is required, report why and include fail-fast diagnostics (`attempted_paths`, `attempted_transports`, `transport_errors`).

## Reliability guardrails by surface

### Frontend path layer
- Keep fallback order documented in routing docs.
- Include attempted paths in error output.

### Persistent backend layer
- Keep tolerant request-shape parsing (`payload`, `body`, `query`, `form`, `postargs`).
- Return structured JSON with explicit status intent.

### Config/secret/state operations
- Use explicit methods and content types.
- Keep reserved field names out of business payload contracts.
- Prefer normalized response envelopes.
- Include write transport compatibility fallbacks for Splunk runtime variance (`jsonargs`, bytes/`rawargs` + JSON content type when required).
- Tolerate non-JSON write responses where runtimes return empty/plain bodies.

## Definition of a good selection

A selection is good when it:

- minimizes moving parts,
- stays consistent with official docs,
- preserves bootstrap packaging and route contracts,
- passes repo validation gates with no manual glue steps.
