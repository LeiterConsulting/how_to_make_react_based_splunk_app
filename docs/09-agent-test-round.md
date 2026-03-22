# Agent Test Round

Use this playbook when you want to verify that an IDE agent can take a short requirement and turn this repo into a packaged Splunk app.

## Inputs to define before the run

- `appId`
- `appLabel`
- short app summary
- target users
- required workflows
- data and persistence assumptions
- whether custom React UI is required

## Recommended run sequence

1. Attach [../chat.md](../chat.md) to the IDE chat session.
2. Give the agent the product requirement.
3. Have the agent choose the nearest worked example or explain why the app shape is new.
4. If the app identity changes, run `npm run template:rename -- --appId <app_id> --appLabel "<App Label>"`.
5. Have the agent explain the chosen Splunk architecture before broad edits.
6. Implement the UI, backend, and configuration changes.
7. Run `npm run validate`.
8. Run `npm run package:splunk` or `npm run release:check`.
9. Check [10-release-checklist.md](10-release-checklist.md) for any remaining release-readiness gaps.
10. Record the results.

## Prompt seed

```text
Build or regenerate a Splunk app in this repository.

Before coding:
- read chat.md, AGENTS.md, docs/01-architecture.md, and docs/09-agent-test-round.md
- choose the nearest worked example from examples/README.md or explain why the app shape is new
- explain the chosen architecture
- prefer Splunk UI Framework components for custom React UI

During implementation:
- keep the app installable
- keep routes, views, and handlers registered correctly
- add concise review comments where future developers need context
- update docs when behavior changes

Before finishing:
- run npm run validate
- run npm run package:splunk or npm run release:check
- report grouped commit messages for the changes
```

## Pass criteria

- `npm run validate` passes
- `npm run package:splunk` succeeds
- the package is produced in `build/`
- the app still mounts through `home.xml`
- at least one UI to backend roundtrip is verified

## Failure categories

- identity drift
- route registration drift
- packaging drift
- doc drift
- unsupported architecture drift
