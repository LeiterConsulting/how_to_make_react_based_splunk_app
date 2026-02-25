# dave Complex App Test Round Log (2026-02-25)

## Round summary

- **Round ID:** dave-complex-app-v1
- **Date:** 2026-02-25
- **Model/agent:** GPT-5.3-Codex (GitHub Copilot)
- **Result:** PASS for identity + build + package
- **App identity:**
  - `appId`: `dave`
  - `appLabel`: `dave`
- **Package output:** `build/dave.tar.gz`

## Scope delivered

- Multi-page React app shell (Overview, Visualize, Secrets, KV Store).
- SPL visualization APIs and UI rendering.
- Secret save/get APIs using app-scoped `passwords.conf` REST endpoints.
- KV list/save APIs with multiple write strategy attempts and diagnostics.

## Commands executed

1. `npm run template:rename -- --appId dave --appLabel "dave"` (failed)
2. Manual folder/view rename to `dave`
3. `npm run sanity:appid -- --appId dave --appLabel "dave"`
4. `npm run build:splunk`
5. `npm run package:splunk`

## Issue encountered

### Rename script source-ID assumption (blocking)

- **Symptom:** `template-rename.mjs` failed with: `Could not find source app folder under splunk_app/.`
- **Cause observed:** script currently assumes source folder `splunk_react_app` constant, but template state had `hello_world_spectrum`.
- **Recovery:** completed manual rename and string/config migration; sanity and packaging then passed.
- **Bootstrap note:** this is a bootstrap tooling issue, not an app feature bug.

## Build/package results

- Explicit sanity run passed: `17 checks`
- Package pipeline sanity run passed: `16 checks`
- Build output produced:
  - `dist-splunk/dave.js`
  - `dist-splunk/dave.css`
- Install package produced:
  - `build/dave.tar.gz`

## Runtime validation status (in this environment)

- Section 1 (build/package): **PASS**
- Sections 2-6 (install/runtime/Splunk route checks): **Pending** (requires Splunk instance execution)

## Runtime expectations to verify in Splunk

1. `Visualize` page: each preset run returns bars and non-empty rows.
2. `Secrets` page: save + get with same key returns stanza metadata and clear/encrypted indicator.
3. `KV Store` page: save record succeeds and appears in refreshed list.
4. Capability gating: removing `app_remote_access` should return structured 403 errors.
