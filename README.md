# How to Make a React + Vite Splunk App (Starter Kit)

This repository is a drop-in starter for building rich Splunk apps with:

- TypeScript + React + Vite frontend
- Splunk persistent REST backend (`restmap.conf` + Python handler)
- Optional Splunk Web custom controller proxy (for resilient browser calls)
- Splunk packaging scripts (`tar.gz`) for app install testing

It is based on proven patterns used in production-style apps and iterative Splunk app hardening cycles.

## What you get

- A working end-to-end vertical slice (UI → controller proxy → splunkd REST handler)
- Defensive frontend path fallback across Splunk environments
- Neutral starter UI ready for domain-specific customization
- Repeatable build/sync/package flow

## Quickstart

```bash
npm install
npm run build:splunk
npm run package:splunk
```

Install output:

- `build/splunk_react_app.tar.gz`

## Agent starting point

AGENT_START_HERE: `docs/09-agent-test-round.md`

Use this routing order for implementation agents:

1. `docs/09-agent-test-round.md` (test-round prompt + execution flow)
2. `docs/12-agent-source-routing-policy.md` (official-doc routing and decision policy)
3. `docs/16-native-app-page-pattern.md` (host architecture choice and migration guidance)
4. `docs/13-sdk-api-selection-matrix.md` (SDK/API surface selection rules)
5. `docs/07-agent-runbook.md` (required build/package sequence)
6. `docs/08-smoke-test.md` (validation and pass/fail criteria)
7. `docs/10-dashboard-chrome-controls.md` (safe chrome suppression/modification policy)
8. `docs/17-splunk-runtime-variance.md` (known runtime variance and mitigations)
9. `docs/06-agent-roadmap.md` (phase goals and release criteria)


Feedback-loop waterfall (required on every test app cycle):

1. Build and validate using `docs/07-agent-runbook.md` + `docs/08-smoke-test.md`.
2. Record any runtime mismatch between expected and observed behavior.
3. Write feedback artifacts to `docs/feedback/<test_app_id>/` using numbered files.
4. Include one issue-ready upstream feedback file in that same folder.
5. On subsequent agent runs, read `docs/feedback/<test_app_id>/` before implementing new changes.

Feedback convention reference: `docs/feedback/README.md`

## Starter structure

- `src/` — React UI and TS client
- `src/llmProxySdk/splunkFetch.ts` — shared Splunk URL/fetch helpers
- `splunk_app/splunk_react_app/bin/app_access.py` — persistent REST handler
- `splunk_app/splunk_react_app/default/restmap.conf` — REST endpoint registrations
- `splunk_app/splunk_react_app/default/web.conf` — Splunk Web exposure rules
- `splunk_app/splunk_react_app/appserver/controllers/app_rest_proxy.py` — custom controller proxy
- `scripts/splunk-sync.mjs` — copies built JS/CSS to Splunk static path
- `scripts/splunk-package.mjs` — creates install tarball

## Make this your own app in minutes

The default app ID is currently `splunk_react_app` to keep this template immediately runnable.

Use the rename helper to generate your own app identity:

```bash
npm run template:rename -- --appId my_new_app --appLabel "My New App"
```

This updates common IDs/labels in frontend + Splunk config files.

## Recommended prototype flow

1. Duplicate this repo/folder into your workspace.
2. Run `template:rename` for your target app ID.
3. Replace `src/App.tsx` UI panels with your prototype domain.
4. Replace `app_access.py` logic with your service logic.
5. Keep `restmap.conf`, `web.conf`, and controller proxy pattern intact.
6. Build/package/install and iterate quickly.

## UI variants (fast start options)

- `npm run variant:rich` keeps the full demonstration UI.
- `npm run variant:minimal` switches to a lightweight shell UI while preserving backend/controller plumbing.

After switching variants, run `npm run build:splunk` (or `npm run package:splunk`).

## Key hardening lessons baked into this template

- Prefer explicit `restmap.conf` route matches for critical endpoints.
- Keep a custom controller proxy available when `splunkd/__raw/services*` behavior is inconsistent.
- Use robust session-key extraction (`session.authtoken`, header variants).
- Separate capability checks from route registration diagnosis.

## Documentation

- `docs/01-architecture.md`
- `docs/02-build-package-install.md`
- `docs/03-proxy-and-routing-patterns.md`
- `docs/04-rapid-prototype-checklist.md`
- `docs/05-ui-variants.md`
- `docs/06-agent-roadmap.md`
- `docs/07-agent-runbook.md`
- `docs/08-smoke-test.md`
- `docs/09-agent-test-round.md`
- `docs/10-dashboard-chrome-controls.md`
- `docs/11-feedback-closure-roadmap.md`
- `docs/12-agent-source-routing-policy.md`
- `docs/13-sdk-api-selection-matrix.md`
- `docs/14-release-notes-2026-02-26.md`
- `docs/15-new-workspace-agent-prompt-kpi-auto-layout.md`
- `docs/16-native-app-page-pattern.md`
- `docs/17-splunk-runtime-variance.md`

- `docs/feedback/README.md`
- `docs/feedback/index_kpi_autolab/README.md`

