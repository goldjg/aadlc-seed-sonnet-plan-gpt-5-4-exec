# Phase 03 – Test Coverage Execution Plan

## Goal

Strengthen automated test coverage for the `cli-typescript-starter` CLI by adding focused unit tests for behaviours that are currently untested or incompletely tested, without altering application source code.

---

## Acceptance Criteria

1. All new and existing tests pass with `pnpm test`.
2. TypeScript compilation succeeds with `pnpm compile`.
3. Every new test file follows the existing Jest + ts-jest conventions (describe/it blocks, `@jest/globals` imports, `jest.restoreAllMocks()` in `afterEach`).
4. Coverage is added for:
   - `greeting` command handler (currently zero tests)
   - `create` command builder path-coercion logic (currently zero tests)
   - `create` command handler: user confirms → `downloadTemplate` called with resolved path
   - `create` command handler: user declines → `downloadTemplate` not called
   - `create` command handler: `downloadTemplate` rejects → `logger.error` called with message
   - `info` command handler: `full: false` → `logger.box` not called in text format
   - `info` command handler: JSON output with `full: false` → no `processConfig` key in payload
   - `src/commands/index.ts` exports: `commands` array contains exactly `info`, `greeting`, and `create` modules
5. No production code is changed unless a change is strictly required to make a behaviour testable (see Non-Goals).
6. No test duplicates any scenario already covered in the existing test files.

---

## Scope

### Files to create

| File | Purpose |
|---|---|
| `src/commands/greeting.test.ts` | Tests for `greeting` command |
| `src/commands/create.test.ts` | Tests for `create` command |

### Files to modify

| File | Change |
|---|---|
| `src/commands/info.test.ts` | Add missing `full: false` variants (text and JSON) |
| `src/index.test.ts` | Replace the trivial placeholder test with a real assertion that `commands` is exported correctly |

---

## Explicit Non-Goals

- Do not modify `src/commands/info.ts`, `src/commands/greeting.ts`, `src/commands/create.ts`, `src/commands/index.ts`, `src/logger.ts`, or `bin/run.ts`.
- Do not add end-to-end or integration tests that spawn a child process or hit the network.
- Do not install new npm packages or update existing ones.
- Do not change `jest.config.js`, `tsconfig.json`, or any build/lint configuration.
- Do not modify benchmark prompts or any other AADLC artefacts.
- Do not add coverage thresholds or coverage reporting configuration.
- Do not test interactive prompts by driving real TTY input; mock `logger.prompt` instead.

---

## Files Expected to Change

```
src/commands/greeting.test.ts    (new)
src/commands/create.test.ts      (new)
src/commands/info.test.ts        (modified – add full:false cases)
src/index.test.ts                (modified – replace placeholder with real assertion)
```

---

## Files That Must Not Change

```
src/commands/info.ts
src/commands/greeting.ts
src/commands/create.ts
src/commands/index.ts
src/logger.ts
src/index.ts
bin/run.ts
bin/run
jest.config.js
tsconfig.json
package.json
pnpm-lock.yaml
.github/aadlc/*          (except this plans directory)
benchmark/prompts/*
```

---

## Test Specifications

### `src/commands/greeting.test.ts`

**greeting – handler**

1. **prompts for name then mood, logs greeting** – mock `logger.prompt` to resolve `'Alice'` then `'👍'`; mock `logger.log`; call `handler()`; assert `logger.log` was called twice with strings containing `'Alice'` and `'👍'`.
2. **second prompt (mood) uses select type** – capture the options object passed to the second `logger.prompt` call; assert `type` is `'select'` and `options` is an array with at least four entries.

**greeting – command shape (INV-003)**

3. **exports required symbols** – import `{ command, describe, aliases, builder, handler }` from `./greeting`; assert each is defined and `aliases` is an array.

---

### `src/commands/create.test.ts`

**create – builder path coercion (INV-009)**

1. **relative path is joined with cwd** – call `builder(yargs(['my-project']).exitProcess(false)).parseSync()`; assert `argv.path === path.join(process.cwd(), 'my-project')`.
2. **absolute path passes through unchanged** – call builder with `['/tmp/my-project']`; assert `argv.path === '/tmp/my-project'`.
3. **default path is joined with cwd** – call builder with `[]`; assert `argv.path === path.join(process.cwd(), 'cli-typescript-starter')`.

**create – handler: user confirms**

4. **calls downloadTemplate with resolved path** – mock `logger.prompt` to resolve `true`; mock `downloadTemplate` (from `giget`) to resolve; mock `logger.box`; call `handler({ _: [], $0: 'create', path: '/resolved/path' })`; assert `downloadTemplate` was called with `'gh:kucherenko/cli-typescript-starter'` and `{ dir: '/resolved/path' }`; assert `logger.box` was called once.

**create – handler: user declines**

5. **does not call downloadTemplate** – mock `logger.prompt` to resolve `false`; mock `downloadTemplate`; call handler; assert `downloadTemplate` was not called.

**create – handler: downloadTemplate rejects**

6. **logs error message** – mock `logger.prompt` to resolve `true`; mock `downloadTemplate` to reject with `new Error('network failure')`; mock `logger.error`; call handler; assert `logger.error` was called with a string containing `'network failure'`.

**create – command shape (INV-003)**

7. **exports required symbols** – assert `command`, `describe`, `aliases`, `builder`, `handler` are all defined.

---

### `src/commands/info.test.ts` additions

**info – full:false in text format**

5. **`logger.box` is not called when `full` is false** – mock `logger.info` and `logger.box`; call `handler({ _: [], $0: 'info', full: false, format: 'text' })`; assert `logger.box` was not called; assert `logger.info` was called 6 times (the `argv` line still fires regardless of `full`).

**info – JSON format with full:false**

6. **processConfig absent from JSON payload when full is false** – mock `process.stdout.write`; call `handler({ _: [], $0: 'info', full: false, format: 'json' })`; parse output; assert `processConfig` key is absent; assert `node`, `arch`, `cwd`, `memoryUsage` are present.

---

### `src/index.test.ts` replacement

Replace the trivial placeholder with:

1. **commands array contains info, greeting, create** – import `{ commands }` from `./commands`; assert `commands` has length 3; assert the array contains the `info`, `greeting`, and `create` modules (compare by reference or by `command` string property).

---

## Mocking Approach

- Mock `giget` module using `jest.mock('giget')` at the top of `create.test.ts`; cast `downloadTemplate` as `jest.MockedFunction`.
- Mock `logger.prompt` using `jest.spyOn(logger, 'prompt')` to avoid real interactive prompts.
- Use `jest.restoreAllMocks()` in `afterEach` in every new test file.
- Do not mock `path` – use the real module so path-coercion assertions reflect actual behaviour.

---

## Validation Commands

Run all of the following in order; all must exit with code 0:

```sh
pnpm test
pnpm compile
pnpm lint
```

Expected: no test failures, no TypeScript errors, no lint errors.

---

## Review Checklist

- [ ] `pnpm test` passes with no failures or skipped tests
- [ ] `pnpm compile` exits 0 (no TypeScript errors in new test files)
- [ ] `pnpm lint` exits 0 (new files satisfy ESLint rules)
- [ ] No production source files were modified
- [ ] No benchmark prompt files were modified
- [ ] All new test files import from `@jest/globals`, not `@types/jest` globals
- [ ] `jest.restoreAllMocks()` is present in `afterEach` in every new test file
- [ ] `giget` is mocked at module level in `create.test.ts`; no real network calls are made
- [ ] `logger.prompt` is spied on (not left unmocked) in all tests that exercise greeting or create handlers
- [ ] INV-003 command-shape assertions are present for `greeting` and `create`
- [ ] INV-009 path-coercion edge cases (relative, absolute, default) are all covered
- [ ] `src/index.test.ts` no longer contains only a trivial `expect(true).toBeTruthy()` assertion
- [ ] No duplicate test scenarios exist across old and new files

---

## Expected Deliverables

| Artefact | Status after execution |
|---|---|
| `src/commands/greeting.test.ts` | New file; ≥ 3 tests |
| `src/commands/create.test.ts` | New file; ≥ 7 tests |
| `src/commands/info.test.ts` | Existing file extended; ≥ 6 tests total |
| `src/index.test.ts` | Existing file updated; trivial placeholder replaced with real assertion |
| All tests passing (`pnpm test`) | ✅ |
| TypeScript clean (`pnpm compile`) | ✅ |
| Lint clean (`pnpm lint`) | ✅ |
