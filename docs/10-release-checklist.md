# Release Checklist

Use this checklist before calling the generator starter ready for wider use.

## Generator contract

- [ ] `chat.md` still matches the active repo workflow
- [ ] `AGENTS.md` still reflects the repo mission and done criteria
- [ ] workspace instructions and file-scoped instructions are still consistent
- [ ] prompt presets reflect the current supported app shapes

## App runtime

- [ ] the starter UI still mounts through `home.xml`
- [ ] `src/App.tsx` remains generic and prompt-driven
- [ ] `bin/app_access.py` and helper modules still expose the starter bootstrap contract
- [ ] route registrations and Splunk Web exposure remain aligned

## Validation

- [ ] `npm run validate` passes on a clean checkout
- [ ] `npm run release:check` passes when the full release gate path is needed
- [ ] backend unit tests pass
- [ ] `npm run package:splunk` produces an installable tarball

## Documentation

- [ ] active docs still point to the correct read order
- [ ] archived docs remain out of the live instruction surface
- [ ] worked examples still pass the example sanity check and include manifests
- [ ] release notes or review notes capture any changed assumptions
- [ ] `CHANGELOG.md` reflects notable generator changes for the release

## Review output

- [ ] grouped commit messages are clear enough for code review
- [ ] any known limitations or unverified runtime assumptions are stated explicitly