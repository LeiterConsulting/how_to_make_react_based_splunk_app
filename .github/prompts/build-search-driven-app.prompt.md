---
description: "Use when generating a search-driven Splunk app that centers on SPL, reports, lookups, and search-backed operator workflows."
---

# Build Search-Driven Splunk App

You are implementing a search-driven Splunk app in this repository.

## First read

1. [chat.md](../../chat.md)
2. [AGENTS.md](../../AGENTS.md)
3. [docs/01-architecture.md](../../docs/01-architecture.md)
4. [docs/09-agent-test-round.md](../../docs/09-agent-test-round.md)

## Focus

- Lead with SPL, saved searches, macros, dashboards, and lookups.
- Only add Python or custom REST routes if the workflow cannot be expressed cleanly with supported search-driven patterns.
- Keep the UI operator-focused and aligned to the search questions being answered.

## Required process

1. Summarize the searches, reports, lookups, and drilldown flows the app needs.
2. Run `npm run template:rename -- --appId <app_id> --appLabel "<App Label>"` if the app identity changes.
3. Implement the minimum viable search objects and UI to answer the operator workflows.
4. Document any macro, lookup, or saved search dependencies.
5. Run `npm run validate`.
6. Run `npm run package:splunk`.
7. Report validation results and grouped commit messages.