# Bootstrap Update Checklist (Splunk React App Template)

Use this checklist to update the root bootstrap project based on what was required to harden and operationalize this template.

## 1) App identity must be single-sourced

- [ ] Choose canonical `appId` (e.g. `my_app_id`) and `appLabel`.
- [ ] Ensure `appId` is consistent across:
  - `splunk_app/<appId>/...` folder name
  - view file name `default/data/ui/views/<appId>.xml`
  - nav entry in `default/data/ui/nav/default.xml`
  - frontend constants in client files (if any)
  - build output names in `vite.splunk.config.ts`
  - packaging/sync scripts (`scripts/splunk-sync.mjs`, `scripts/splunk-package.mjs`)
- [ ] Ensure launcher/UI label in `default/app.conf` matches `appLabel`.
- [ ] Keep/extend a rename utility (like `scripts/template-rename.mjs`) for repeatable identity changes.

## 2) Build and package pipeline for Splunk

- [ ] Keep dedicated Splunk build config (`vite.splunk.config.ts`) producing deterministic names:
  - single JS bundle (IIFE)
  - single CSS asset
  - output to `dist-splunk`
- [ ] Keep sync script that copies built assets into `splunk_app/<appId>/appserver/static`.
- [ ] Keep package script that creates `build/<appId>.tar.gz` from `splunk_app/<appId>`.
- [ ] Keep `package:splunk` script as: build -> sync -> tarball.

## 3) Splunk route architecture (UI -> backend)

- [ ] Keep 3-layer model:
  1. React UI
  2. Splunk Web custom controller proxy (optional but recommended)
  3. Persistent REST handler (`bin/*.py` via `restmap.conf`)
- [ ] Persistent REST routes must be explicit and complete in `default/restmap.conf`.
- [ ] Include both app-prefixed and short matches where portability is needed.

## 4) Web exposure compatibility

- [ ] In `default/web.conf`, expose both controller spellings for compatibility:
  - `app_rest_proxy/*`
  - `apprestproxy/*`
- [ ] Expose app-scoped endpoint patterns used by the UI.
- [ ] Require authentication for sensitive endpoints.

## 5) Frontend endpoint fallback strategy

- [ ] Centralize Splunk fetch path construction in one client helper.
- [ ] Keep fallback candidates for environment differences:
  - custom controller path
  - `servicesNS/nobody/<appId>/...`
  - `services/<appId>/...` (if applicable)
- [ ] Capture attempted paths in errors for troubleshooting.

## 6) Persistent config write safety

- [ ] Do not use reserved conf entity field names as business keys (e.g. avoid posting business `name` directly as stanza field).
- [ ] For config persistence, use stable field names (example: `profile_name` instead of `name`).
- [ ] Handle "already exists" and update-vs-create fallbacks safely.
- [ ] Return normalized response payloads to the UI.

## 7) Session/auth hardening in backend

- [ ] Keep robust session key extraction from:
  - request session object
  - request headers (`Authorization: Splunk ...`)
- [ ] Keep backend capability checks centralized in persistent handler.
- [ ] Return structured JSON errors with status codes.

## 8) Static assets expected by Splunk chrome

- [ ] Keep app icon available where Splunk app bar expects it:
  - `splunk_app/<appId>/static/appLogo.png`
- [ ] Keep app bundle assets in:
  - `splunk_app/<appId>/appserver/static/*.js|*.css`

## 9) Documentation required in bootstrap root

- [ ] Architecture overview (request flow and path strategy)
- [ ] Build/package/install runbook
- [ ] Proxy/routing compatibility notes
- [ ] Rapid prototype checklist
- [ ] Rename/app-id customization instructions

## 10) Validation steps before publishing template changes

- [ ] `npm install`
- [ ] `npm run build:splunk`
- [ ] `npm run package:splunk`
- [ ] Install tarball in Splunk test instance
- [ ] Restart Splunk and verify dashboard mounts
- [ ] Verify backend endpoints with `btool` where applicable
- [ ] Confirm no unresolved static 404s (especially `appLogo.png`)

## Optional improvements for template quality

- [ ] Add diagnostics endpoint for route/path introspection during onboarding.
- [ ] Add automated sanity script to check appId consistency across known files.
- [ ] Add a minimal smoke test doc for first install on a clean Splunk instance.
