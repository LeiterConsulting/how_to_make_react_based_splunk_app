# Asset Inventory Workbench Example

This folder is a worked example of what a generated app output can look like when the prompt calls for a REST-backed CRUD workflow over structured inventory data.

It is a reference package, not the active app payload used by this starter.

## What it demonstrates

- a prompt tailored to the app goal
- a custom React surface using Splunk UI components
- a narrow Python handler contract
- matching Splunk route registration and collection configuration
- implementation notes for the next developer or agent

## Folder map

- [example.manifest.json](example.manifest.json) - machine-readable summary of example shape and required files
- [prompt.md](prompt.md) - the requirement that would be given to the agent
- [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) - architecture and continuation notes
- [src/App.tsx](src/App.tsx) - example generated React surface
- [splunk_app/asset_inventory_workbench/bin/app_access.py](splunk_app/asset_inventory_workbench/bin/app_access.py) - example generated handler
- [splunk_app/asset_inventory_workbench/default/restmap.conf](splunk_app/asset_inventory_workbench/default/restmap.conf) - route registration
- [splunk_app/asset_inventory_workbench/default/collections.conf](splunk_app/asset_inventory_workbench/default/collections.conf) - KV Store collection definition
- [splunk_app/asset_inventory_workbench/default/data/ui/views/home.xml](splunk_app/asset_inventory_workbench/default/data/ui/views/home.xml) - launcher view host