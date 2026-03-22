# Fact and Evidence Standard (Repository Guidance)

Use this standard for all architecture guidance, prompts, and acceptance gates in this repository.

## Objective

Ensure repo instructions are:

- documentation-grounded,
- runtime-verifiable,
- deterministic for agent execution.

## Claim classification (required)

Every non-trivial guidance claim should map to one class:

1. **DOC_FACT**
   - backed by official Splunk documentation reference.
2. **RUNTIME_FACT**
   - observed in reproducible runtime validation with captured evidence.
3. **POLICY_RULE**
   - repository guardrail designed to reduce risk and ambiguity.

Do not present `POLICY_RULE` as vendor documentation fact.

## Minimum evidence requirements

- For `DOC_FACT`: include source URL and short rationale in the related doc section.
- For `RUNTIME_FACT`: include reproducible signature and validation context in `docs/feedback/<appId>/` artifacts.
- For architecture decisions: include host mode and controller-feasibility classification.

## Prohibited guidance patterns

- Conflating launcher view routes (`/app/...`) with controller routes (`/custom/...`).
- Labeling redirect-shim or wrapper-based startup as native delivery.
- Claiming controller-native viability without feasibility classification.
- Using speculative endpoint shapes as first attempt when canonical shapes are defined.

## Review checklist before merge

1. Claim class identified (`DOC_FACT`, `RUNTIME_FACT`, `POLICY_RULE`).
2. Links/evidence included where required.
3. No contradiction with `docs/19-splunk10-native-baseline.md`.
4. Smoke-test gates still deterministic and executable.
