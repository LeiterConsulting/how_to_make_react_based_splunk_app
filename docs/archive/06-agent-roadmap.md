# Agent Enablement Roadmap (Bootstrap/SKD)

This roadmap operationalizes `docs/feedback/BOOTSTRAP_UPDATE_CHECKLIST.md` into phased delivery work so coding agents can reliably generate bespoke Splunk apps from this bootstrap.

## Goal

Enable an agent to go from "new app intent" to "installable Splunk package" with predictable outcomes, low manual intervention, and clear failure diagnostics.

Baseline focus: Splunk 10 launcher-view delivery (`/app/<appId>/home`) with deterministic packaging and runtime validation.

## Migration note (2026-02)

This template originally started from a terminal-focused app skeleton in another workspace. It has been normalized to generic starter naming so generated apps are domain-agnostic by default.

- Default app identity moved from `splunk_terminal_app` to `splunk_react_app`.
- REST and web exposure naming moved from terminal-specific routes/controllers to `app_api`, `app_rest_proxy`, and `apprestproxy`.
- Backend/frontend starter file names moved to neutral forms (`app_access.py`, `appClient.ts`, `app_settings.conf`, `app_assets.conf`).

Use this mapping when reviewing older notes, logs, or past agent output.

## Success criteria (program-level)

- **Packaging reliability:** 95%+ of generated apps produce `build/<appId>.tar.gz` on first run.
- **Install readiness:** 100% of generated packages pass static asset and route validation checks before install.
- **Runtime readiness:** 90%+ of generated apps launch via `/app/<appId>/home` and complete one backend roundtrip in a clean Splunk test instance.
- **Identity consistency:** 100% appId consistency across all known required files via automated sanity check.
- **Actionable failures:** 100% of route/fetch failures include attempted paths and normalized error payloads.

## Phase 1 — Identity and packaging baseline

**Scope**

- Single-source app identity (`appId`, `appLabel`) and deterministic asset naming.
- Build → sync → package pipeline as the default path.
- Ensure icon/static placement expected by Splunk chrome.

**Deliverables**

- Extend or harden `scripts/template-rename.mjs` to cover all identity touch points.
- Keep deterministic output in `vite.splunk.config.ts` (single JS, single CSS, `dist-splunk`).
- Keep packaging scripts (`scripts/splunk-sync.mjs`, `scripts/splunk-package.mjs`) appId-driven.
- Add/verify `static/appLogo.png` presence check before packaging.

**Exit criteria**

- Rename command updates all listed identity locations with zero manual edits.
- `npm run package:splunk` consistently emits `build/<appId>.tar.gz`.
- No unresolved static 404 for app logo or bundle assets in install verification.

## Phase 2 — Route compatibility and auth hardening

**Scope**

- Preserve resilient 3-layer path model (UI → controller proxy → persistent REST).
- Explicit REST registration and web exposure compatibility.
- Robust session key extraction and centralized capability checks.

**Deliverables**

- Confirm complete endpoint coverage in `default/restmap.conf`.
- Keep dual controller exposure (`app_rest_proxy/*`, `apprestproxy/*`) in `default/web.conf`.
- Standardize structured JSON error responses in persistent handler.

**Exit criteria**

- Endpoint matrix document exists and maps UI calls to REST matches.
- Authenticated route checks pass for supported path variants.
- Unauthorized/capability-denied cases return normalized JSON with HTTP status.

## Phase 3 — Frontend fallback and diagnostics

**Scope**

- Centralized path construction and fallback strategy.
- Better diagnostics for path mismatch and environment quirks.

**Deliverables**

- Keep all path candidates in one helper (`src/llmProxySdk/splunkFetch.ts` or equivalent).
- Include attempted URL candidates in thrown errors.
- Add optional backend diagnostics endpoint for route/path introspection.

**Exit criteria**

- UI can recover via fallback paths when primary controller path is unavailable.
- Failure payload clearly lists attempted paths and final HTTP response context.
- Diagnostics endpoint (if enabled) returns registered route metadata for onboarding.

## Phase 4 — Config write safety and response contracts

**Scope**

- Eliminate config write edge cases and unsafe field naming.
- Normalize backend response shapes for agent and UI consumption.

**Deliverables**

- Replace reserved/conflicting field usage patterns (e.g., business `name`) with stable keys.
- Implement safe create/update fallback semantics for stanzas.
- Define and document normalized response envelope for success/error payloads.

**Exit criteria**

- Duplicate-create and update flows behave deterministically in tests/manual checks.
- Responses are schema-consistent across create/read/update/delete flows.
- UI consumes backend payloads without endpoint-specific parsing branches.

## Phase 5 — Agent contract and automation guardrails

**Scope**

- Convert operational knowledge into machine-actionable checks and prompts.
- Ensure generated apps are validated before human handoff.

**Deliverables**

- Add `scripts/sanity-check-appid.mjs` to verify appId consistency across known files.
- Add `docs/07-agent-runbook.md` with exact agent execution sequence and expected artifacts.
- Add `docs/08-smoke-test.md` for clean Splunk-instance verification.

**Exit criteria**

- Agent runbook can be executed end-to-end without undocumented manual steps.
- Sanity script fails fast with file-level mismatch output.
- Smoke test yields clear pass/fail for mount, backend ping, and static asset load.

## Milestone plan

- **M1 (1 week):** Complete Phase 1 and Phase 2 baselines.
- **M2 (1 week):** Complete Phase 3 diagnostics and frontend fallback observability.
- **M3 (1 week):** Complete Phase 4 response contract and config safety.
- **M4 (1 week):** Complete Phase 5 automation and agent runbook packaging.

## Definition of done (template release)

- All checklist sections 1–10 validated and marked complete.
- Optional improvements either implemented or explicitly deferred with rationale.
- Build/package/install validation executed on a clean Splunk test instance.
- Repo includes docs for architecture, packaging runbook, routing compatibility, prototype checklist, rename flow, and agent runbook.

## Tracking model (recommended)

- Use one issue per phase with linked sub-tasks per deliverable.
- Attach evidence to each exit criterion (logs, screenshots, package hash, endpoint output).
- Require successful `npm run package:splunk` and sanity-check output before merge.
