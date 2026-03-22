---
description: "Use when generating a REST-backed CRUD style Splunk app with structured persistence, explicit handlers, and a custom operator workflow."
---

# Build REST-Backed CRUD Splunk App

You are implementing a Splunk app in this repository with explicit REST handlers and structured persistence.

## First read

1. [chat.md](../../chat.md)
2. [AGENTS.md](../../AGENTS.md)
3. [docs/01-architecture.md](../../docs/01-architecture.md)
4. [docs/09-agent-test-round.md](../../docs/09-agent-test-round.md)

## Focus

- Choose the persistence mechanism deliberately: KV Store, lookups, or conf-backed settings.
- Keep handlers narrow and return predictable JSON.
- Use Splunk UI Framework components for custom CRUD workflows.

## Required process

1. Summarize the data model, CRUD operations, permissions, and persistence choice.
2. Run `npm run template:rename -- --appId <app_id> --appLabel "<App Label>"` if the app identity changes.
3. Implement the handler contract, Splunk route registration, and operator UI together.
4. Document why the chosen persistence model fits the app.
5. Run `npm run validate`.
6. Run `npm run package:splunk`.
7. Report validation results and grouped commit messages.