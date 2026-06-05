# Execution Plan: phase-02-validation-bug

## Goal

Fix the handling of invalid values supplied to the `--format` option of the `info` command so that they are rejected with a clear, actionable error message and the handler behaves deterministically for all inputs.

---

## Acceptance criteria

1. Passing an unsupported value for `--format` (e.g. `--format xml`) produces a clear error message and exits non-zero.
2. The `handler` function itself guards against an unrecognised format value and throws (or logs and exits) rather than silently falling through to the text path.
3. All existing tests continue to pass.
4. New or updated tests cover the invalid-format code path directly on the `handler`.
5. `pnpm test` exits 0.
6. `pnpm compile` exits 0.
7. `pnpm lint` exits 0.

---

## Scope

- Investigate `src/commands/info.ts`: understand current `builder` choices configuration and `handler` branching logic.
- Investigate `src/commands/info.test.ts`: determine whether the existing `'rejects unsupported format values'` test passes or fails; if it fails, that is the primary defect.
- Fix `src/commands/info.ts` handler to explicitly guard against unexpected `format` values.
- Update `src/commands/info.test.ts` to cover the handler-level guard (in addition to the builder-level Yargs rejection already present).

---

## Explicit non-goals

- Do not modify any command other than `info`.
- Do not change the `format` choices (`text`, `json`) or add new ones.
- Do not refactor unrelated code (logging, path handling, `create` command, etc.).
- Do not modify benchmark prompt files under `benchmark/`.
- Do not modify AADLC artefacts other than this plan file.
- Do not change `bin/run.ts` or any entry-point files.
- Do not add new dependencies.

---

## Files expected to change

| File | Expected change |
|---|---|
| `src/commands/info.ts` | Add an explicit guard in `handler` for unrecognised `format` values; throw an error or log and exit with a clear message. |
| `src/commands/info.test.ts` | Add a test that calls `handler` directly with an invalid `format` value and asserts it throws or rejects with a descriptive error. |

---

## Files that must not change

- `benchmark/prompts/phase-02-validation-bug.md`
- `.github/aadlc/memory.md`
- `.github/aadlc/invariants.yml`
- `.github/aadlc/trust-boundaries.md`
- `.github/copilot-instructions.md`
- `src/commands/create.ts`
- `src/commands/greeting.ts`
- `src/commands/index.ts`
- `src/index.ts`
- `src/logger.ts`
- `bin/run.ts`
- `bin/run`
- All configuration files (`tsconfig.json`, `jest.config.js`, `tsup.config.ts`, `package.json`, `pnpm-lock.yaml`, `.eslintrc*`, `.prettierrc*`, etc.)

---

## Validation commands

Run the following in order. Every command must exit 0 before the task is complete.

```sh
pnpm test
pnpm compile
pnpm lint
```

---

## Review checklist

- [ ] `pnpm test` passes with no failures or skipped tests.
- [ ] `pnpm compile` reports no TypeScript errors.
- [ ] `pnpm lint` reports no ESLint errors.
- [ ] The `handler` in `src/commands/info.ts` has an explicit branch or guard that handles any `format` value that is not `'text'` or `'json'`.
- [ ] The error message emitted for an invalid format value names the option and/or the received value (actionable).
- [ ] The existing test `'rejects unsupported format values'` passes (builder-level Yargs rejection).
- [ ] At least one new test exercises the handler-level guard directly (i.e., calls `handler` with an invalid format, bypassing Yargs parsing).
- [ ] No files outside the **Files expected to change** list have been modified.
- [ ] No new npm/pnpm dependencies have been added.
- [ ] Commit message follows Conventional Commits format (e.g. `fix(info): handle invalid format option values`).

---

## Expected deliverables

1. Updated `src/commands/info.ts` with a handler-level guard for invalid `format` values.
2. Updated `src/commands/info.test.ts` with tests covering the invalid-format handler path.
3. All three validation commands (`pnpm test`, `pnpm compile`, `pnpm lint`) passing.
