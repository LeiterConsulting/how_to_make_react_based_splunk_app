# Prompt

Build or regenerate a Splunk app in this repository.

App purpose:
Help analysts investigate suspicious activity by giving them search-driven dashboards, reusable macros, and lookup-backed hunt metadata.

Target users:
Detection engineers, SOC analysts, and incident responders.

Primary workflows:
- Review active hunt coverage and recent matches
- Pivot from overview panels into filtered search results
- Track hunt status and owner context with a lookup
- Reuse macros to keep search logic consistent across dashboards

Data sources and searches:
- Security event indexes
- Saved searches for investigation summaries
- Macros for shared predicates
- Hunt metadata lookup

Persistence needs:
- Lookup-backed metadata only

Backend requirements:
- None unless later enrichment cannot be handled through search objects

UI requirements:
- Native Splunk dashboards first
- Search-backed drilldowns
- Minimal custom code

Constraints:
- Keep the app installable
- prefer SPL, macros, and lookups before custom backend logic
- document search dependencies clearly

Acceptance criteria:
- package builds successfully
- investigation workflows are understandable from the dashboards
- shared search logic is documented and reusable