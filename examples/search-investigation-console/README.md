# Search Investigation Console Example

This folder is a worked example of what a generated app output can look like when the prompt is search-driven and the app centers on SPL, macros, lookups, and operator drilldowns.

It is a reference package, not the active app payload used by this starter.

## What it demonstrates

- a search-driven prompt tailored to investigation workflows
- native Splunk dashboards backed by saved searches and macros
- a small lookup dependency instead of a custom backend
- operator drilldowns built around search questions rather than CRUD forms

## Folder map

- [example.manifest.json](example.manifest.json) - machine-readable summary of example shape and required files
- [prompt.md](prompt.md) - the requirement that would be given to the agent
- [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) - architecture and continuation notes
- [splunk_app/search_investigation_console/default/data/ui/nav/default.xml](splunk_app/search_investigation_console/default/data/ui/nav/default.xml) - example app navigation
- [splunk_app/search_investigation_console/default/data/ui/views/home.xml](splunk_app/search_investigation_console/default/data/ui/views/home.xml) - launcher view
- [splunk_app/search_investigation_console/default/data/ui/views/investigation_console.xml](splunk_app/search_investigation_console/default/data/ui/views/investigation_console.xml) - operator dashboard
- [splunk_app/search_investigation_console/default/savedsearches.conf](splunk_app/search_investigation_console/default/savedsearches.conf) - search object definitions
- [splunk_app/search_investigation_console/default/macros.conf](splunk_app/search_investigation_console/default/macros.conf) - macro examples for reusable search fragments
- [splunk_app/search_investigation_console/lookups/hunt_status.csv](splunk_app/search_investigation_console/lookups/hunt_status.csv) - lookup example used by the dashboard