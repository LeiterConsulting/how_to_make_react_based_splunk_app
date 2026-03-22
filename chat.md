# Add this file to your IDE chat

Use this file as the context pack for any agent that is about to build or regenerate a Splunk app from this repository.

## Mission

Turn a plain-English requirement into a real Splunk app that can be installed, reviewed, extended, and packaged from this starter.

## Non-negotiables

- Keep the Splunk app installable.
- Use supported Splunk folder conventions.
- Prefer native Splunk views and configuration before custom code.
- When custom React UI is required, prefer Splunk UI Framework components first.
- Keep backend handlers narrow and registered correctly.
- Do not invent placeholder files with no integration path.
- Update docs and validation scripts when the architecture changes.

## Files to read before coding

1. [AGENTS.md](AGENTS.md)
2. [README.md](README.md)
3. [docs/01-architecture.md](docs/01-architecture.md)
4. [docs/09-agent-test-round.md](docs/09-agent-test-round.md)
5. [.github/copilot-instructions.md](.github/copilot-instructions.md)

## Optional prompt presets

Use these when the app shape is obvious and you want a faster start:

- [.github/prompts/build-dashboard-first-app.prompt.md](.github/prompts/build-dashboard-first-app.prompt.md)
- [.github/prompts/build-rest-crud-app.prompt.md](.github/prompts/build-rest-crud-app.prompt.md)
- [.github/prompts/build-search-driven-app.prompt.md](.github/prompts/build-search-driven-app.prompt.md)

## Reference example

Use [examples/asset-inventory-workbench/README.md](examples/asset-inventory-workbench/README.md) when you want to inspect what a worked generated app can look like across UI, backend, and Splunk config.

Use [examples/service-health-overview/README.md](examples/service-health-overview/README.md) when you want a dashboard-first reference that leans on native Splunk views.

Use [examples/search-investigation-console/README.md](examples/search-investigation-console/README.md) when you want a search-driven reference built around dashboards, saved searches, macros, and lookup-backed operator context.

Use [examples/README.md](examples/README.md) when you want to choose the closest worked example before coding.

## Example selection

Choose the nearest worked reference before implementation:

- pick `asset-inventory-workbench` when the app needs explicit CRUD flows, structured persistence, and a custom React operator surface
- pick `service-health-overview` when the app is mostly dashboards, saved searches, and drilldowns
- pick `search-investigation-console` when the app is search-driven and should lean on SPL, macros, reports, and lookups before custom backend logic
- if neither fits well, state that clearly and explain the new app shape before broad edits

You can also run `npm run example:pick -- --appShape <shape>` for a manifest-based suggestion.

Add `--keywords <terms>` when the app shape alone is too broad and you want the picker to weight specific workflow words like `lookup`, `crud`, `macros`, or `forms`.

Add `--json` when the picker result needs to be consumed programmatically instead of read as text.

Add `--top <n>` when you want several close manifest matches instead of only the best one.

## Prompt template

Paste the requirement below into chat after attaching this file:

```text
Build or regenerate a Splunk app in this repository.

App purpose:
<what problem the app solves>

Target users:
<who uses it>

Primary workflows:
<top 3 to 5 workflows>

Data sources and searches:
<indexes, sourcetypes, lookups, saved searches, REST inputs, or unknown>

Persistence needs:
<KV Store, lookups, conf files, none, or unknown>

Backend requirements:
<REST handlers, search commands, external APIs, none, or unknown>

UI requirements:
<dashboards, custom React page, Splunk UI Framework, drilldowns, forms>

Constraints:
<cloud compatibility, capabilities, deployment shape, naming rules>

Acceptance criteria:
<what must be true before packaging>
```

## Required execution sequence

1. Rename the starter with `npm run template:rename -- --appId <app_id> --appLabel "<App Label>"` when the target identity changes.
2. Choose the nearest worked example or explicitly declare that the app shape is new.
3. Derive the architecture before editing files.
4. Keep `src/App.tsx` and `bin/app_access.py` generic unless the prompt explicitly requires product-specific behavior.
5. Run `npm run validate` before packaging.
6. Run `npm run package:splunk` for the final bundle.

## Required outputs from the agent

- code and config changes
- concise code comments where future review needs extra context
- documentation updates
- validation results
- grouped commit messages for the change set

## Review checklist

- Are all routes registered and exposed correctly?
- Does the UI follow Splunk expectations instead of generic web patterns?
- Is the persistence mechanism appropriate for the data?
- Did the agent keep the starter instructions in sync with the code?
- Can the next developer understand how to continue?

## Release gate

Use [docs/10-release-checklist.md](docs/10-release-checklist.md) before treating the generator starter as release-ready.

Use `npm run release:check` when you want the full repo gate path in one command.