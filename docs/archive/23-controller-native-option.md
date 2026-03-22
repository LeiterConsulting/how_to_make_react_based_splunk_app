# Controller-Native Option (Explicit Opt-In)

This repository does **not** enable controller-native app pages by default.

Baseline behavior remains launcher-native-view (`/app/<appId>/home`).

## Purpose

Use controller-native routes only for scenarios where a non-launcher custom surface is a hard requirement and you accept runtime variance risk.

## When to use (valid scenarios)

Enable this option only when **all** are true:

1. A requirement explicitly calls for a custom route surface under `/custom/<appId>/...`.
2. Launcher-view host behavior is insufficient for the feature goal.
3. Your target runtime(s) can validate custom controller feasibility.

Typical examples:

- Specialized app pages that must not use SimpleXML host lifecycle.
- Environment-specific integrations that require custom controller request handling.
- Internal deployments with known controller-route availability contracts.

## When not to use

Do **not** enable for default prototypes or broad-template rounds where reliability across unknown runtimes is primary.

If your objective is only to launch reliably from app tile, keep launcher-native-view baseline.

## Enablement steps (opt-in)

1. Add `appserver/controllers/app_page.py` with appId-scoped mount HTML.
2. Add `[expose:app_page]` in `default/web.conf` with `pattern = app_page`.
3. Keep launcher route baseline intact (`/app/<appId>/home`) and document host intent.
4. Run `npm run sanity:appid` and `npm run package:splunk`.
5. In runtime validation, test both:
   - `/app/<appId>/home`
   - `/custom/<appId>/app_page`
6. Record feasibility classification:
   - `custom-controller available`
   - `custom-controller unavailable`

## Required evidence for native claim

A controller-native claim is allowed only when all evidence exists:

- `/custom/<appId>/app_page` returns success in target runtime,
- UI mount is confirmed on that route,
- host-shell evidence is captured,
- smoke report includes launcher status + controller-native status.

If `/custom` returns `404`, classify native objective as `FAIL` and keep launcher-native baseline.
