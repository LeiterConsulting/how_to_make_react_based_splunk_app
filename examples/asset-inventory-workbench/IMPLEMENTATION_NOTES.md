# Implementation Notes

## Architecture summary

- Use KV Store for asset records because the data is structured, low-volume, and CRUD-oriented.
- Use a custom React page because operators need an editable workflow rather than a read-only dashboard.
- Keep the handler narrow: one endpoint family under `asset_inventory_api`.

## Continuation points

- Add capability checks if the app needs privileged write operations.
- Expand validation around owner fields and allowed asset statuses.
- Add saved searches only if the overview cards need summary metrics from event data.

## Review reminder

The generated app should keep route registration, KV Store definitions, and the UI contract aligned. If one changes, update the others in the same review.