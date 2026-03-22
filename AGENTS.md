# Splunk App Generator Starter

This repository exists to help an IDE agent turn a plain-English requirement into a real Splunk app that is installable, maintainable, and aligned with supportable Splunk patterns.

## Mandatory read order

1. [chat.md](chat.md)
2. [README.md](README.md)
3. [docs/01-architecture.md](docs/01-architecture.md)
4. [docs/09-agent-test-round.md](docs/09-agent-test-round.md)

## Delivery target

Each substantive change should move the repo toward this outcome:

- a user can describe a Splunk app in a short prompt
- the agent can implement it inside this starter
- the result still packages as a valid Splunk app
- the implementation remains understandable by the next developer or agent

## Core rules

- Favor supportable Splunk patterns over clever shortcuts.
- Use native Splunk dashboards and configuration first, then custom React only when justified.
- Prefer Splunk UI Framework components for custom React pages.
- Keep frontend, backend, and persistence concerns separated.
- Do not leave placeholder handlers or undocumented routes behind.
- Keep the starter shell generic; domain-specific logic belongs in generated app code.
- Document any new persistence choice, dependency, or architectural deviation.

## Required repo behaviors

- `chat.md` is the attach-to-chat context pack for implementation sessions.
- `.github/copilot-instructions.md` provides always-on workspace rules.
- `.github/prompts/build-splunk-app.prompt.md` provides a reusable implementation prompt.
- `scripts/sanity-check-instructions.mjs` must keep validating those files.
- `scripts/template-rename.mjs` must keep new instruction files in sync with renamed app IDs.

## Backend expectations

- Keep persistent REST handlers narrow and explicit.
- Register every handler through `restmap.conf` and expose only what Splunk Web needs.
- Return structured JSON with predictable keys.
- Validate inputs and surface meaningful errors.

## Frontend expectations

- Treat the current `src/App.tsx` as a starter shell, not a finished product.
- Build high-value operator workflows, not generic brochure UI.
- Keep runtime diagnostics visible when they help debug Splunk route variance.

## Definition of done

The work is done only when:

- `npm run validate` passes
- `npm run package:splunk` produces a bundle
- the app remains installable
- the docs match the implementation
- commit boundaries are clear enough for review