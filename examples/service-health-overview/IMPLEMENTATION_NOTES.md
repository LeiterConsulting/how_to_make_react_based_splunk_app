# Implementation Notes

## Architecture summary

- Use native Splunk XML views because the workflow is mostly read-only and search-driven.
- Keep the launcher small and send operators to the main dashboard immediately.
- Model panel data with saved searches so the app remains easy to review and extend.

## Continuation points

- Add a lookup-backed owner map if service ownership needs richer metadata.
- Add drilldowns into a service detail dashboard when the overview is stable.
- Introduce custom React only if operators need workflow controls that dashboards cannot express cleanly.

## Review reminder

If the dashboard grows beyond search-and-drilldown workflows, re-evaluate whether the app should stay dashboard-first or move to a custom surface.