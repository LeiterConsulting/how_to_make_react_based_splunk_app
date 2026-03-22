# Examples Index

Use these worked references when you want to inspect what a generated app can look like after prompt-driven implementation.

## Worked examples

- [asset-inventory-workbench/README.md](asset-inventory-workbench/README.md) - REST-backed CRUD example with Splunk UI custom page, KV Store shape, and explicit handler contract
- [service-health-overview/README.md](service-health-overview/README.md) - dashboard-first example that stays close to native Splunk views, saved searches, and navigation
- [search-investigation-console/README.md](search-investigation-console/README.md) - search-driven example using dashboards, saved searches, macros, and a lookup-backed operator workflow

Each worked example includes an `example.manifest.json` file so agents and validation scripts can reason about the example shape without scraping prose.

Use `npm run example:pick -- --appShape <shape>` when you want a quick manifest-based best match. You can also add `--keywords <terms>` to bias the result toward specific workflows or technologies.

Add `--json` when another script or agent wants a machine-readable picker result.

Add `--top <n>` when you want the highest-ranked few examples instead of only the single best match.

## How to use them

- Start with the prompt file to understand the requirement shape.
- Read the implementation notes to see why the architecture was chosen.
- Compare the Splunk config and UI surface to the active starter when planning a new generation pass.