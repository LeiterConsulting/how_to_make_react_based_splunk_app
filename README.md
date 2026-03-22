# Splunk App Generator Starter

This repository is a reusable starter for building installable Splunk apps from a short prompt inside an IDE.

The operating model is straightforward:

1. Attach [chat.md](chat.md) to the chat session.
2. Give the agent a plain-English app requirement.
3. Let the agent rename, implement, validate, and package the app.

The repo is intentionally opinionated about supportable Splunk patterns:

- React 18 + Splunk UI Framework for custom UI when native dashboards are not enough
- Persistent REST in `bin/app_access.py` for narrow backend capabilities
- Optional Splunk Web controller proxy for runtime variance
- Packaging scripts that produce a real `.tar.gz` app bundle
- Agent instructions and prompts checked into the workspace

## Start here

- Attach [chat.md](chat.md) to your IDE chat session.
- Read [AGENTS.md](AGENTS.md) for repo rules and expected delivery quality.
- Review [docs/01-architecture.md](docs/01-architecture.md) for the active architecture.
- Use [.github/prompts/build-splunk-app.prompt.md](.github/prompts/build-splunk-app.prompt.md) if you want a ready-made implementation prompt.

## Quickstart

```bash
npm install
npm run validate
npm run package:splunk
```

For the full release gate path in one command:

```bash
npm run release:check
```

Install output:

- `build/splunk_react_app.tar.gz`

## Generator workflow

1. Rename the starter for your target app.

```bash
npm run template:rename -- --appId my_new_app --appLabel "My New App"
```

2. Tell the agent what the app should do. Reference [chat.md](chat.md) in the session.
3. Have the agent choose the nearest worked example or declare a new app shape.
4. Have the agent update the React UI, Splunk config, Python handlers, and docs as needed.
5. Validate with `npm run validate`.
6. Package with `npm run package:splunk`.

## Repo layout

- `chat.md` - attach-this-to-chat context pack for IDE agents
- `AGENTS.md` - repo-level behavior and acceptance rules
- `.github/copilot-instructions.md` - always-on workspace instructions
- `.github/instructions/generated-app-surface.instructions.md` - file-scoped rules for generated app implementation surfaces
- `.github/prompts/build-splunk-app.prompt.md` - reusable implementation prompt
- `.github/prompts/build-dashboard-first-app.prompt.md` - dashboard-first implementation prompt
- `.github/prompts/build-rest-crud-app.prompt.md` - REST-backed CRUD implementation prompt
- `.github/prompts/build-search-driven-app.prompt.md` - search-driven implementation prompt
- `docs/01-architecture.md` - active system architecture
- `docs/09-agent-test-round.md` - execution playbook for agent runs
- `docs/10-release-checklist.md` - release readiness checklist for the generator starter
- `src/` - starter React shell, reusable UI sections, and Splunk client code
- `splunk_app/splunk_react_app/` - installable Splunk app payload
- `tests/python/` - backend unit tests for the starter contract
- `examples/README.md` - index of worked generated app references
- `examples/asset-inventory-workbench/` - worked generated app reference with matching UI, backend route, and config
- `examples/service-health-overview/` - worked dashboard-first reference using native views and saved searches
- `examples/search-investigation-console/` - worked search-driven reference using dashboards, saved searches, macros, and a lookup
- `scripts/` - rename, validation, sync, and packaging helpers

## Preferred UI rule

When a custom page is justified, prefer Splunk UI Framework components first. The starter shell now uses Splunk UI directly and keeps local CSS limited to layout glue around framework components.

## Active docs

See [docs/README.md](docs/README.md) for the current documentation index and which files are active versus legacy reference material.

## Prompt examples

Use the base prompt or choose a more specific starting point:

- [.github/prompts/build-splunk-app.prompt.md](.github/prompts/build-splunk-app.prompt.md)
- [.github/prompts/build-dashboard-first-app.prompt.md](.github/prompts/build-dashboard-first-app.prompt.md)
- [.github/prompts/build-rest-crud-app.prompt.md](.github/prompts/build-rest-crud-app.prompt.md)
- [.github/prompts/build-search-driven-app.prompt.md](.github/prompts/build-search-driven-app.prompt.md)

## Example variants

Starter variants provide example shapes that align with the current architecture:

- `npm run variant:dashboard`
- `npm run variant:rest-crud`
- `npm run variant:minimal`
- `npm run variant:rich`

## Worked example

See [examples/asset-inventory-workbench/README.md](examples/asset-inventory-workbench/README.md) for a complete reference example showing the shape of a generated REST-backed CRUD app.

See [examples/service-health-overview/README.md](examples/service-health-overview/README.md) for a dashboard-first reference that stays close to native Splunk views.

See [examples/search-investigation-console/README.md](examples/search-investigation-console/README.md) for a search-driven reference that uses saved searches, macros, and a lookup-backed workflow.

Browse the full worked-example index in [examples/README.md](examples/README.md).

Worked examples now include machine-readable manifests so validation and future agents can inspect example shape without relying only on prose.

Use `npm run example:pick -- --appShape <shape>` when you want a quick manifest-based example recommendation.

Add `--keywords <terms>` if you want the picker to weight specific workflow words in the example manifests.

Add `--json` if you want structured picker output for another script or agent.

Add `--top <n>` if you want the picker to return several high-ranked matches.

## Release gate command

Use `npm run release:check` to run the full repo gate path in order: validate first, then package.

## Changelog

Track generator evolution in [CHANGELOG.md](CHANGELOG.md).

