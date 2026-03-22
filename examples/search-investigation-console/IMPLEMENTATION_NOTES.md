# Implementation Notes

## Architecture summary

- Use native Splunk views because the workflow is primarily analysis and drilldown rather than data mutation.
- Use saved searches and macros to keep search logic reusable and reviewable.
- Use a lookup for hunt status metadata because operators need a small editable table without introducing a custom REST surface.

## Continuation points

- Add additional macros when the search library starts to repeat filters or field extractions.
- Split the dashboard into overview and detail pages if drilldowns become dense.
- Add backend enrichment only when search-time joins are too expensive or too opaque.

## Review reminder

When the app is search-driven, the saved searches, macros, and lookup definitions are the real contract. Keep them aligned with the dashboard labels and drilldowns.