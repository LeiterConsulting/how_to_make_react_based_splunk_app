---
description: "Use when generating a dashboard-first Splunk app with light or no custom backend logic. Reads chat.md, favors native views first, and keeps packaging intact."
---

# Build Dashboard-First Splunk App

You are implementing a dashboard-first Splunk app in this repository.

## First read

1. [chat.md](../../chat.md)
2. [AGENTS.md](../../AGENTS.md)
3. [docs/01-architecture.md](../../docs/01-architecture.md)
4. [docs/09-agent-test-round.md](../../docs/09-agent-test-round.md)

## Focus

- Prefer native Splunk views, saved searches, and configuration before writing custom React or Python.
- If a custom React page is still justified, extend the Splunk UI starter shell rather than replacing the repo contract.
- Avoid backend handlers unless the workflow clearly needs them.

## Required process

1. Summarize the dashboards, filters, drilldowns, and saved searches the app needs.
2. Run `npm run template:rename -- --appId <app_id> --appLabel "<App Label>"` if the app identity changes.
3. Implement the smallest useful set of views, searches, and app navigation.
4. Update docs and include concise review comments where configuration choices need explanation.
5. Run `npm run validate`.
6. Run `npm run package:splunk`.
7. Report validation results and grouped commit messages.