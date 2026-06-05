# Phase 04 – Refactor: Output Formatting

## Goal

Extract the output formatting logic from `src/commands/info.ts` into a dedicated
formatter module, reducing coupling between command handler logic and presentation
concerns, without changing any observable behaviour.

---

## Acceptance Criteria

1. All existing Jest tests pass without modification (`pnpm test`).
2. TypeScript compilation succeeds without errors (`pnpm compile`).
3. ESLint reports no new errors (`pnpm lint`).
4. The `info` command produces identical output in both `--format text` and
   `--format json` modes before and after the refactor.
5. Formatting logic (colour application, JSON object construction) lives in a
   separate module, not inline inside `handler`.
6. `handler` in `src/commands/info.ts` delegates to the formatter; it does not
   call `picocolors` functions directly.
7. The formatter module is unit-testable in isolation (pure functions or
   functions whose only side-effect dependency is the shared logger and
   `process.stdout.write`).
8. No new runtime dependencies are added (`package.json` dependencies unchanged).

---

## Current Design

`src/commands/info.ts` `handler` performs three distinct concerns inline:

1. **Input validation** – checks that `format` is a known value.
2. **Data collection** – reads `process.version`, `process.arch`, `process.cwd()`,
   `process.memoryUsage()`, and `process.config`.
3. **Output formatting & emission** – applies PicoColors styling (text mode) or
   builds a plain object and serialises it with `JSON.stringify` (JSON mode),
   then writes directly via `logger.info` / `logger.box` / `process.stdout.write`.

Concerns 2 and 3 are entangled: colour decorators are applied at the same call
site where data is read. This makes it hard to test formatting independently,
reuse formatting elsewhere, or swap output strategies.

`src/commands/create.ts` and `src/commands/greeting.ts` contain only trivial
inline colour calls (one or two per handler) and do not warrant extraction.

---

## Why Refactoring Is Beneficial

- **Testability**: a pure formatter function can be tested without invoking the
  full command handler or mocking the logger.
- **Readability**: `handler` becomes a thin orchestrator; the formatting details
  are out of view.
- **Extensibility**: adding a future format (e.g., `--format csv`) requires
  touching only the formatter, not the handler.
- **Reduced coupling**: `handler` no longer imports PicoColors directly.

---

## Identified Risks

| Risk | Mitigation |
|---|---|
| Accidental behaviour change in colour or JSON output | Existing tests cover both paths; run `pnpm test` after each edit |
| Breaking the `logger.box` / `logger.info` call sequence checked by `infoSpy` / `boxSpy` counts | Formatter must call logger in the same order and frequency as before |
| New module not covered by type-check | `pnpm compile` must pass |
| ESLint rule violations in new file | `pnpm lint` must pass |

---

## Scope

### In scope

- Create `src/formatters/info.ts` containing:
  - `formatInfoText(data, full: boolean): void` – calls the shared logger with
    the coloured output in the existing order (6 `logger.info` calls, optionally
    1 `logger.box` call when `full` is `true`).
  - `formatInfoJson(data, full: boolean): void` – builds the output object and
    writes it via `process.stdout.write` exactly as the current handler does.
  - A `InfoData` interface (or type) describing the data shape passed to both
    functions.
- Update `src/commands/info.ts` `handler` to:
  - Collect data into an `InfoData` object.
  - Delegate to `formatInfoText` or `formatInfoJson` depending on `argv.format`.
  - Remove direct PicoColors imports from `info.ts`.

### Out of scope (explicit non-goals)

- Refactoring `src/commands/create.ts` or `src/commands/greeting.ts`.
- Changing the public API of any command (exported `command`, `describe`,
  `aliases`, `builder`, `handler` symbols).
- Adding new tests (existing tests must pass; new tests are not required).
- Changing test files.
- Adding or removing npm dependencies.
- Changing `src/logger.ts`.
- Changing `bin/run.ts` or `bin/run`.
- Altering any `.github/aadlc/` artefact other than this plan.
- Altering benchmark prompts.
- Changing `package.json`, `tsconfig.json`, `jest.config.js`, ESLint or
  Prettier configuration.

---

## Files Expected to Change

| File | Change |
|---|---|
| `src/commands/info.ts` | Handler delegates to formatter; PicoColors imports removed |
| `src/formatters/info.ts` | **New file** – contains `InfoData`, `formatInfoText`, `formatInfoJson` |

---

## Files That Must Not Change

- `src/commands/create.ts`
- `src/commands/greeting.ts`
- `src/commands/index.ts`
- `src/index.ts`
- `src/logger.ts`
- `bin/run.ts`
- `bin/run`
- All test files (`src/**/*.test.ts`)
- `package.json`
- `tsconfig.json`
- `jest.config.js`
- `.eslintrc*` / `eslint.config.*`
- `.prettierrc*`
- `tsup.config.ts`
- All `.github/aadlc/` files except this plan
- All `benchmark/` files

---

## Validation Commands

Run these in order after completing the refactor. All must exit with code 0.

```sh
pnpm compile   # TypeScript type-check – no errors
pnpm lint      # ESLint – no new errors
pnpm test      # Jest – all tests pass
```

Optional smoke-check (does not affect pass/fail):

```sh
npx ts-node bin/run.ts info --format text
npx ts-node bin/run.ts info --format json
```

---

## Review Checklist

- [ ] `src/formatters/info.ts` exists and exports `InfoData`, `formatInfoText`,
      `formatInfoJson`.
- [ ] `src/commands/info.ts` no longer imports from `picocolors` directly.
- [ ] `handler` in `src/commands/info.ts` contains no inline colour formatting.
- [ ] `formatInfoText` calls `logger.info` exactly 6 times and `logger.box`
      exactly once when `full` is `true` (matching the counts asserted in
      `info.test.ts`).
- [ ] `formatInfoJson` calls `process.stdout.write` exactly once (matching the
      assertion in `info.test.ts`).
- [ ] No test file has been modified.
- [ ] `pnpm compile` exits 0.
- [ ] `pnpm lint` exits 0.
- [ ] `pnpm test` exits 0 with all tests passing.
- [ ] No new dependencies appear in `package.json`.
- [ ] Diff is small and reviewable (target: ≤ ~60 lines changed across all files).

---

## Expected Deliverables

1. **`src/formatters/info.ts`** – new file containing the extracted formatting
   functions and the `InfoData` type.
2. **`src/commands/info.ts`** – updated to remove inline formatting and delegate
   to the formatter.
3. Evidence of passing validation: output of `pnpm compile`, `pnpm lint`, and
   `pnpm test` all exit 0.
