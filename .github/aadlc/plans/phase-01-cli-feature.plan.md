# Execution Plan: Phase 01 – CLI Output Format Flag

## Goal

Add `--format text` and `--format json` options to the `info` command so that users can switch between the existing human-readable terminal output and machine-readable JSON output. All other commands are unaffected. Existing default behaviour is preserved.

---

## Acceptance Criteria

1. `cli info --format text` (or omitting `--format`) produces output identical to the current behaviour.
2. `cli info --format json` prints a single JSON object to stdout containing at minimum: `node`, `arch`, `cwd`, `memoryUsage`.  
   When `--full` is also set, the JSON object additionally contains a `processConfig` key.
3. `--format` accepts only `text` or `json`; any other value causes Yargs to print a usage error and exit non-zero.
4. The default value of `--format` is `text`.
5. All existing Jest tests continue to pass (`pnpm test`).
6. TypeScript compilation succeeds without errors (`pnpm compile`).
7. ESLint reports no new errors (`pnpm lint`).
8. The `--help` output for the `info` command documents the `--format` option.
9. `README.md` (or equivalent user-facing docs) reflects the new `--format` option if docs already describe the `info` command.

---

## Scope

- Add `--format` option to `src/commands/info.ts` only.
- Branch the `handler` to write either coloured logger output (text) or a single `JSON.stringify` call to `process.stdout` (json).
- Add or update unit tests in `src/commands/info.test.ts` (create file if absent) covering both format paths.

---

## Non-Goals

- Do not add `--format` to `greeting` or `create` commands.
- Do not introduce a shared formatter utility unless the implementation naturally requires one to stay under ~20 LOC in the handler; if a utility is added, it must live in `src/` and export a single function.
- Do not change the Consola logger instance in `src/logger.ts`.
- Do not modify `bin/run.ts` or `src/commands/index.ts`.
- Do not change `tsconfig.json`, `jest.config.js`, `tsup.config.ts`, or any CI/CD configuration.
- Do not alter the `greeting` or `create` command files.
- Do not add new runtime dependencies; use only packages already present in `package.json`.

---

## Files Expected to Change

| File | Change |
|---|---|
| `src/commands/info.ts` | Add `format` option to `InfoArgv` interface, extend `builder`, branch `handler` |
| `src/commands/info.test.ts` | Create (if absent) or extend with tests for `--format text` and `--format json` |
| `README.md` | Add `--format` to the `info` command description if the command is already documented there |

---

## Files That Must Not Change

| File | Reason |
|---|---|
| `bin/run.ts` | Entry point invariant (INV-001) |
| `src/commands/index.ts` | Command registration invariant (INV-002) |
| `src/logger.ts` | Shared logger invariant (INV-004) |
| `src/commands/greeting.ts` | Out of scope |
| `src/commands/create.ts` | Out of scope |
| `src/index.ts` | Out of scope |
| `package.json` | No new dependencies; no script changes |
| `tsconfig.json` | Build invariant (INV-006) |
| `jest.config.js` | Test invariant (INV-005) |
| `tsup.config.ts` | Packaging invariant (INV-010) |
| `.github/aadlc/*` | AADLC artefacts must not alter application behaviour |
| `benchmark/prompts/*` | Benchmark prompts must not be modified |

---

## Validation Commands

Run these in order after implementation. All must succeed with exit code 0.

```sh
pnpm compile        # TypeScript type-check — must emit zero errors
pnpm lint           # ESLint — must report zero new errors
pnpm test           # Jest — all tests must pass
```

Manual smoke tests (informational, not automated):

```sh
# Default (text) output
npx ts-node bin/run.ts info

# Explicit text format
npx ts-node bin/run.ts info --format text

# JSON format
npx ts-node bin/run.ts info --format json

# JSON format + full flag
npx ts-node bin/run.ts info --format json --full

# Invalid format — must exit non-zero with usage error
npx ts-node bin/run.ts info --format xml
```

---

## Review Checklist

- [ ] `InfoArgv` interface includes `format?: 'text' | 'json'`.
- [ ] `builder` registers `--format` with `choices: ['text', 'json']` and `default: 'text'`.
- [ ] `handler` branches on `argv.format === 'json'` vs. default text path.
- [ ] JSON path uses `process.stdout.write` or `console.log` with `JSON.stringify`; it does **not** call `logger.*` methods (Consola adds formatting that breaks JSON consumers).
- [ ] JSON output object contains keys: `node`, `arch`, `cwd`, `memoryUsage` (and optionally `processConfig` when `--full`).
- [ ] Text path is unchanged from current behaviour (same logger calls, same colours).
- [ ] No new `import` statements introduce packages not already in `package.json`.
- [ ] No `any` types introduced; `InfoArgv` is fully typed.
- [ ] Tests mock or spy on `process.stdout.write` / `console.log` (JSON path) and `logger` (text path) rather than spawning a subprocess.
- [ ] `pnpm compile`, `pnpm lint`, and `pnpm test` all pass.
- [ ] Commit message follows Conventional Commits format (e.g. `feat(info): add --format flag`).

---

## Expected Deliverables

1. **`src/commands/info.ts`** – updated with `--format` option and branched handler.
2. **`src/commands/info.test.ts`** – new or updated test file with at minimum:
   - Test: `--format json` outputs valid JSON containing the expected keys.
   - Test: `--format text` (or default) invokes `logger.info` (existing behaviour).
   - Test: invalid `--format` value is rejected by Yargs (optional, lower priority).
3. **`README.md`** – updated `info` command documentation if the command is currently documented.
4. Passing CI (all three validation commands above exit 0).

---

## Risks and Assumptions

| # | Risk / Assumption | Mitigation |
|---|---|---|
| R1 | Consola formats output and is not JSON-safe; piping `logger.info` with a JSON object will not produce clean JSON. | Use `process.stdout.write(JSON.stringify(...) + '\n')` in the JSON path; do not route JSON output through Consola. |
| R2 | `--full` interacts with `--format`; the combination must be handled explicitly. | Plan explicitly covers this combination in JSON output spec. |
| R3 | The existing test file (`src/index.test.ts`) is a placeholder; the absence of `info.test.ts` means no regression baseline for `info`. | Create `src/commands/info.test.ts` as part of this feature. |
| R4 | Yargs `choices` validation is sufficient for rejecting unknown format values. | Confirmed by Yargs ^17 documentation; no additional guard needed. |
