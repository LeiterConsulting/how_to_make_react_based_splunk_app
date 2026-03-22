# Service Health Overview Example

This folder is a worked example of what a generated app output can look like when the prompt is primarily dashboard-first and can lean on native Splunk views.

It is a reference package, not the active app payload used by this starter.

## What it demonstrates

- a dashboard-first prompt tailored to operator monitoring
- native Splunk navigation and XML views instead of a large custom React surface
- saved searches as the primary data contract
- a launcher page that stays installable and easy to review

## Folder map

- [example.manifest.json](example.manifest.json) - machine-readable summary of example shape and required files
- [prompt.md](prompt.md) - the requirement that would be given to the agent
- [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) - architecture and continuation notes
- [splunk_app/service_health_overview/default/data/ui/nav/default.xml](splunk_app/service_health_overview/default/data/ui/nav/default.xml) - example app navigation
- [splunk_app/service_health_overview/default/data/ui/views/home.xml](splunk_app/service_health_overview/default/data/ui/views/home.xml) - launcher view
- [splunk_app/service_health_overview/default/data/ui/views/service_health.xml](splunk_app/service_health_overview/default/data/ui/views/service_health.xml) - operator dashboard
- [splunk_app/service_health_overview/default/savedsearches.conf](splunk_app/service_health_overview/default/savedsearches.conf) - native search object definitions