# Agent Source Routing Policy (Doc-Grounded Build Direction)

This repository is a **directional control plane** for agentic Splunk app builds.
It is not intended to duplicate upstream SDK/API documentation.

Platform baseline: Splunk 10.x.

## Purpose

When an implementation agent makes architecture or API decisions, it must combine:

1. Bootstrap constraints and proven patterns from this repo.
2. Official Splunk source documentation for selected SDK/API surfaces.
3. Validation gates in this repo (`sanity:appid`, `package:splunk`, smoke checks).

## Primary official sources

- Splunk Developer Guide (Develop apps): https://dev.splunk.com/enterprise/docs/developapps/
- Splunk app extension points: https://dev.splunk.com/enterprise/docs/developapps/extensionpoints/
- Splunk app visualization guidance: https://dev.splunk.com/enterprise/docs/developapps/visualizedata/
- JavaScript SDK: https://docs.splunk.com/DocumentationStatic/JavaScriptSDK/1.11.0/index.html
- Java SDK: https://docs.splunk.com/DocumentationStatic/JavaSDK/1.9.1/index.html
- Python SDK: https://docs.splunk.com/DocumentationStatic/PythonSDK/2.1.1/index.html
- Splunk Web Framework Component Reference: https://docs.splunk.com/DocumentationStatic/WebFramework/1.5/index.html

Use Developer Guide pages as primary source for route-model and UI-host claims; use SDK references for API-client behavior.

## Required decision order (agents)

1. **Identity and packaging constraints first**
   - Preserve app identity contract and packaging pipeline in this repo.
2. **Choose API surface from official docs**
   - Select JS/Java/Python/Web Framework based on runtime boundary.
3. **Apply bootstrap reliability rules**
   - Route fallback strategy, auth handling, structured error responses, capability controls.
4. **Implement minimal change set**
   - Avoid speculative features and keep behavior scoped to requested outcomes.
5. **Prove with validation gates**
   - Run repo gates and produce concise failure diagnostics when blocked.

## Non-negotiable rules

- Do not invent SDK methods or undocumented endpoint contracts.
- Do not treat this repo docs as replacing SDK references.
- Do not introduce global Splunk UI behavior changes when view-scoped patterns exist.
- Do not bypass validation gates before handoff.
- Do not claim controller-native architecture unless feasibility classification is recorded.
- Do not present dashboard-wrapper redirects as native delivery.

## Evidence requirement in agent outputs

For each significant implementation decision, agents must report:

- selected API surface (JS SDK / Python SDK / Java SDK / Web Framework / raw REST),
- why that surface was chosen for the boundary,
- what repo guardrail(s) were applied,
- which validation gate confirms the change.

## Escalation path

If official docs and repo patterns appear to conflict:

1. prefer stable official API behavior,
2. preserve repo reliability contracts where compatible,
3. document the conflict and propose a minimal adaptation path.
