# Phase 06 – Review Hardening Findings

## Findings

| ID | Area | Description | Classification | Justification |
|---|---|---|---|---|
| F-001 | Validation environment | `pnpm` is unavailable in the execution shell, so validation was run with `npm run compile`, `npm run lint`, and `npm run test` instead of the plan’s `pnpm` commands. | No action required | `npm run` invokes the same repository scripts, so this is an execution-environment deviation rather than a repository defect. |
| F-002 | Validation configuration | `npm run lint` fails because the repository does not contain a discoverable ESLint configuration file. | Accepted risk | Fixing this would require changing lint configuration, which is explicitly out of scope for the approved phase-06 plan. |
| F-003 | CLI contract | `src/commands/create.ts` declared the command as `create <path>` even though the builder supplies a default path and the README states the path may be omitted. | Fixed | Changing the command string to `create [path]` aligns the CLI contract, help output, and runtime behaviour with the documented default-path semantics. |
| F-004 | Test coverage | `src/commands/create.test.ts` validated path coercion through a synthetic `--path` option instead of the real positional CLI contract. | Fixed | Updating the tests to parse the registered `create [path]` command validates the real user-facing path handling and closes the missing-validation gap. |
| F-005 | AADLC artefact currency | `.github/aadlc/current-pr-contract.md` still described phase 00 hydration instead of the active phase-06 review-hardening work. | Fixed | Updating the contract keeps the active PR artefact aligned with the approved phase and its deliverables. |

## Deviations

- Validation used `npm run ...` instead of `pnpm ...` because `pnpm` is not installed in the shell environment.
- `npm run lint` remains red because ESLint cannot find a repository config file; this was recorded as accepted risk because changing lint configuration is out of scope.

## Summary

- Total findings: **5**
- Fixed: **3**
- Accepted risk: **1**
- No action required: **1**
