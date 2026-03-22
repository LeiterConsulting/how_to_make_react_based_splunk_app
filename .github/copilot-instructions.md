# Workspace instructions for Splunk app generation

- Treat [chat.md](../chat.md) as the required context pack for prompt-driven implementation work.
- Read [AGENTS.md](../AGENTS.md) before making architectural changes.
- Prefer supportable Splunk patterns and explicit configuration over hidden magic.
- Prefer Splunk UI Framework components for custom React surfaces whenever they fit the requirement.
- Keep the starter shell generic. Product-specific UI and backend logic should be driven by the active prompt.
- Apply `.github/instructions/generated-app-surface.instructions.md` when editing generated app implementation files.
- When adding or changing agent-facing files, keep `scripts/sanity-check-instructions.mjs` and `scripts/template-rename.mjs` in sync.
- Preserve packaging: `npm run validate` and `npm run package:splunk` must remain meaningful.