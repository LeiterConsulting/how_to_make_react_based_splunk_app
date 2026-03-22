---
description: "Use when editing generated app implementation surfaces such as src/App.tsx, src/components, splunk_app/**, and app-facing docs. Keeps starter infrastructure separate from prompt-specific product code."
applyTo: "src/App.tsx,src/components/**,src/appClient.ts,splunk_app/**,docs/01-architecture.md,docs/09-agent-test-round.md,README.md,chat.md"
---

# Generated App Surface Rules

- Treat these files as the app implementation surface, not the generator infrastructure.
- Put product-specific workflows, labels, persistence choices, and backend routes here when the prompt requires them.
- Keep `scripts/`, `.github/`, and starter validation logic generic unless the generation contract itself changes.
- When you add a backend route, update the matching Splunk exposure and registration files in the app payload.
- When you add persistence, document why that mechanism fits the use case.
- If a prompt only changes product behavior, avoid editing global agent instructions unless the existing instructions are wrong.