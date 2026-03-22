---
description: "Use when building or regenerating a Splunk app from a plain-English requirement in this repository. Reads chat.md, preserves installability, and packages the result."
---

# Build Splunk App From Prompt

You are implementing a Splunk app in this repository.

## First read

1. [chat.md](../../chat.md)
2. [AGENTS.md](../../AGENTS.md)
3. [docs/01-architecture.md](../../docs/01-architecture.md)
4. [docs/09-agent-test-round.md](../../docs/09-agent-test-round.md)

## Required process

1. Summarize the app goal and choose the simplest supportable architecture.
2. Run `npm run template:rename -- --appId <app_id> --appLabel "<App Label>"` if the prompt changes the app identity.
3. Implement only the files needed for the requested workflow.
4. Prefer Splunk UI Framework components for custom React UI.
5. Update docs and concise review comments where the next developer needs context.
6. Run `npm run validate`.
7. Run `npm run package:splunk`.
8. Report validation results and grouped commit messages.

## Definition of done

- The app still packages cleanly.
- Routes, views, and handlers are wired together.
- The implementation is understandable without tribal knowledge.
- The final response includes commit messages grouped by logical change set.