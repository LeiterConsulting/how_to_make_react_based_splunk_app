# Changelog

All notable changes to this generator starter should be recorded in this file.

## 0.2.0 - 2026-03-22

- Reframed the repository around an agent-first prompt-to-app workflow.
- Added `chat.md`, `AGENTS.md`, workspace instructions, file-scoped instructions, and prompt presets.
- Adopted Splunk UI Framework as the custom React baseline.
- Split the starter backend into helper modules and added backend unit tests.
- Added example app variants and a worked generated app reference.
- Added a second worked example for the dashboard-first app shape and an examples index.
- Added route registration drift tests that verify the starter contract against `restmap.conf`.
- Added machine-readable example manifests and an example sanity check wired into validation and packaging.
- Added a single `release:check` command and updated agent guidance to choose the nearest worked example before implementation.
- Added a search-driven worked example and a manifest-driven example picker command.
- Added keyword-aware example scoring metadata and expanded backend tests for malformed JSON and method normalization.
- Added machine-readable JSON output for the example picker and expanded handler tests for bootstrap and diagnostics response shape.
- Added top-N picker output and expanded request-variance tests for empty bodies and missing paths.
- Archived historical hardening docs and introduced a release checklist.