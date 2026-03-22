# Architecture

This repo is now organized around prompt-driven Splunk app generation, not around a single sample app domain.

## Active layers

1. Agent context layer
2. Generator runtime layer
3. Splunk packaging layer
4. Release readiness layer

## 1. Agent context layer

These files tell the IDE agent how to work:

- [../chat.md](../chat.md) is the attach-to-chat context pack
- [../AGENTS.md](../AGENTS.md) defines repo rules and done criteria
- [../.github/copilot-instructions.md](../.github/copilot-instructions.md) provides always-on workspace instructions
- [../.github/instructions/generated-app-surface.instructions.md](../.github/instructions/generated-app-surface.instructions.md) governs generated app implementation surfaces
- [../.github/prompts/build-splunk-app.prompt.md](../.github/prompts/build-splunk-app.prompt.md) provides a reusable prompt entrypoint
- [../.github/prompts/build-dashboard-first-app.prompt.md](../.github/prompts/build-dashboard-first-app.prompt.md), [../.github/prompts/build-rest-crud-app.prompt.md](../.github/prompts/build-rest-crud-app.prompt.md), and [../.github/prompts/build-search-driven-app.prompt.md](../.github/prompts/build-search-driven-app.prompt.md) provide prompt presets for common app shapes

This layer exists so the next implementation session does not have to rediscover the repo contract from scratch.

## 2. Generator runtime layer

The runtime is a neutral scaffold:

- `src/App.tsx` orchestrates data loading and composes reusable starter sections
- `src/components/` contains reusable Splunk UI sections for the starter shell
- `src/main.tsx` and `src/splunk/splunkMain.tsx` wrap the app with `SplunkThemeProvider`
- `src/appClient.ts` calls starter endpoints with Splunk path fallbacks
- `splunk_app/<appId>/bin/app_access.py` exposes `ping`, `bootstrap`, and `diagnostics`
- `splunk_app/<appId>/bin/app_access_splunk.py` isolates Splunk session and config access helpers
- `splunk_app/<appId>/bin/app_access_payloads.py` isolates starter payload construction and defaults
- `splunk_app/<appId>/appserver/controllers/app_rest_proxy.py` remains available as a compatibility proxy

The runtime must stay generic enough that an agent can replace or extend it for a specific app request without first unwinding sample business logic.

## 3. Splunk packaging layer

Packaging remains conventional and explicit:

- `scripts/template-rename.mjs` updates app identity across code, config, and agent files
- `scripts/sanity-check-instructions.mjs` validates the agent instruction surface
- `scripts/sanity-check-appid.mjs` checks app identity consistency
- `scripts/splunk-sync.mjs` copies built assets into the Splunk app
- `scripts/splunk-package.mjs` creates the installable `.tar.gz`

## 4. Release readiness layer

This layer keeps the starter honest as it evolves:

- `tests/python/test_app_access_contract.py` covers the backend starter contract with lightweight unit tests
- `docs/10-release-checklist.md` defines the release gate for the generator starter
- `starter_variants/dashboard-first` and `starter_variants/rest-crud` provide example app shapes aligned to the current architecture
- `examples/asset-inventory-workbench/` shows a worked generated app reference spanning prompt, UI, backend, and Splunk config
- `examples/service-health-overview/` shows a worked dashboard-first reference spanning prompt, native views, navigation, and saved searches
- `examples/search-investigation-console/` shows a worked search-driven reference spanning prompt, dashboards, macros, saved searches, and a lookup
- `scripts/sanity-check-examples.mjs` verifies that worked examples keep their manifest and minimum file set intact

## UI rule

If the generated app needs a custom React UI, prefer Splunk UI Framework components first. The starter is already wired to `@splunk/react-ui` and `@splunk/themes`, so generated apps should extend that baseline before adding bespoke UI primitives.

## Backend rule

Use Python only when SPL, dashboards, lookups, or Splunk configuration are not sufficient. When Python is needed, keep handlers narrow and registered explicitly in `restmap.conf`.
