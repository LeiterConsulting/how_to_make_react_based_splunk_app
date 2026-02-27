# Supported App Reliability Cues (Adopted)

This document records reliability cues observed from a vetted supported app and how they are applied in this repository without copying source implementation.

## Adopted cues

1. **View-level chrome suppression for launcher/fallback views**
   - Cue: dashboard views in supported app set `hideEdit="true"` for operator-facing pages.
   - Adoption: launcher host `home.xml` enforces `hideEdit="true"` by default.

2. **App-local metadata export scope**
   - Cue: supported app defaults object export to `none` and scopes sharing intentionally.
   - Adoption: `metadata/default.meta` root stanza uses `export = none` as baseline.

3. **Explicit UI compatibility declarations**
   - Cue: supported app sets `show_in_nav` and `supported_themes` explicitly in `app.conf`.
   - Adoption: template requires `show_in_nav = true` and `supported_themes = light,dark`.

4. **Manifested deployment targeting**
   - Cue: supported app includes `app.manifest` with deployment/workload declarations.
   - Adoption: template now includes `app.manifest` baseline with supported deployment targets.

5. **Distributed bundle hygiene**
   - Cue: supported app uses `distsearch.conf` replication blacklist to avoid shipping generated/local artifacts.
   - Adoption: template includes `default/distsearch.conf` with app-scoped lookup/bin blacklist defaults.

## Guardrails encoded

The following are enforced via `npm run sanity:appid`:

- launcher host mounts React root on `/app/<appId>/home`,
- launcher host view sets `hideEdit=true`,
- `app.manifest` exists and id matches appId,
- metadata root export scope is `none`,
- `distsearch.conf` exists and is appId-scoped.

Optional guardrail:

- when `app_page.py` exists, it must be appId-consistent and exposed in `web.conf`.

## Non-adopted cues (intentional)

- Large SimpleXML dashboard architecture and SPL business logic patterns are not part of this template baseline.
- Domain-specific macros/saved searches/lookup schemas are intentionally excluded.
