# Prompt

Build or regenerate a Splunk app in this repository.

App purpose:
Give operations teams a dashboard-first view of service health, alert volume, and ownership so they can triage issues quickly.

Target users:
Operations leads, NOC analysts, and service owners.

Primary workflows:
- Review current service health by team and severity
- Spot services with rising alert volume
- Drill into a selected service for details
- Open the next dashboard or search when a problem needs investigation

Data sources and searches:
- Indexes with health and alert events
- Saved searches for overview panels
- optional lookup for service ownership metadata

Persistence needs:
- None or lookup-backed metadata only

Backend requirements:
- None unless a later phase requires custom enrichment

UI requirements:
- Native Splunk dashboards and forms first
- Minimal custom code
- Clear drilldowns and operator defaults

Constraints:
- Keep the app installable
- prefer native Splunk views over custom React
- document any saved search dependencies

Acceptance criteria:
- package builds successfully
- dashboard flow is understandable
- native views answer the main operator questions