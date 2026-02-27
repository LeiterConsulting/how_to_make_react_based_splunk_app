# Dashboard Chrome Controls (Agent Policy)

Use this guide when an app requires hiding or modifying Splunk dashboard chrome elements (for example: favorite star, Edit, Export, overflow `...`).

## Default policy

- Default bootstrap behavior is **suppress-actions** on launcher bridge/fallback views.
- Agents should keep suppression enabled unless a user explicitly requests otherwise.
- Changes must be **view-scoped** to the app view, not global across Splunk.

Supported-app lessons adopted:

- prefer XML-level view controls first (`hideEdit="true"` for bridge/fallback views),
- keep any JS/CSS behavior app-local and view-scoped,
- do not rely on global DOM hacks across Splunk pages.

## Allowed vs not allowed

### Allowed

- View-local XML options (where supported by Splunk version).
- App-local CSS in `appserver/static/<appId>.css` scoped to a specific dashboard view.
- Hiding action buttons while preserving page functionality and app routing.

### Not allowed

- Global CSS that affects all Splunk apps.
- Disabling unrelated Splunk navigation/chrome outside requested scope.
- JavaScript DOM hacks that run before every page load across Splunk.

## Implementation order (preferred)

1. **Try XML-level controls first** in `default/data/ui/views/<appId>.xml`.
2. If XML controls are insufficient, apply **scoped CSS** in `appserver/static/<appId>.css`.
3. Validate in Splunk runtime after restart and confirm no regressions.

## Scoped CSS pattern (recommended)

Use selectors scoped to the current view container to avoid global side effects.

```css
/* Example: scope to this dashboard root only */
#splunk-react-app-root {
  /* marker for scoping only */
}

/* Example suppression targets (verify per Splunk version) */
body[data-view="<appId>"] .dashboard-actions,
body[data-view="<appId>"] .dashboard-toolbar .btn-edit,
body[data-view="<appId>"] .dashboard-toolbar .btn-export {
  display: none !important;
}
```

Notes:

- Selector class names can vary by Splunk version/theme.
- Agents must verify selectors in browser devtools for the target instance.
- Keep selectors as narrow as possible (prefer view/app-specific attributes).

## Agent input requirement

When launching an implementation agent, include a chrome policy statement:

- `chromePolicy`: `suppress-actions` (default) | `default` | `custom`
- `chromeTargets`: list of elements allowed to hide/modify

Example:

- `chromePolicy: suppress-actions`
- `chromeTargets: favorite, edit, export, overflow`

## Full-page viewport baseline (optional mode)

When an app is intended to run as a full-page launcher shell:

- Set the app root shell to `min-height: 100dvh` (or `height: 100dvh` when appropriate).
- Avoid page-level vertical scroll for shell pages.
- Keep scrolling inside app panels/regions rather than on `body`.

This keeps dashboard wrappers from reintroducing unwanted page scroll while preserving panel-level usability.

## Validation checklist

- Requested chrome targets are hidden/modified as specified.
- Non-target controls remain unchanged.
- App content renders and interactions still work.
- No style leakage into other Splunk apps/views.
- In full-page mode, no unwanted body-level vertical scrolling is introduced.
