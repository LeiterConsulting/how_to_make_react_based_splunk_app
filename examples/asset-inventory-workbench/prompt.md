# Prompt

Build or regenerate a Splunk app in this repository.

App purpose:
Give operations teams a place to track business-critical assets, ownership, lifecycle status, and remediation notes.

Target users:
Platform operators, service owners, and reliability engineers.

Primary workflows:
- Create and edit asset records
- Review assets by status and owner
- Flag assets that need remediation attention
- Keep operator notes attached to each record

Data sources and searches:
- KV Store-backed application records
- optional summary search for dashboard metrics

Persistence needs:
- KV Store

Backend requirements:
- REST handlers for listing, creating, updating, and deleting asset records

UI requirements:
- Custom React page using Splunk UI Framework components
- Overview cards, editable table, and detail form

Constraints:
- Keep the app installable
- keep routes narrow and explicit
- document the persistence choice

Acceptance criteria:
- package builds successfully
- CRUD route contract is clear
- UI follows Splunk operator workflow expectations