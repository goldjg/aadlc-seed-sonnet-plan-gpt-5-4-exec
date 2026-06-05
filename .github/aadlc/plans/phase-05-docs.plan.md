# Phase 05 – Documentation Improvements

## Goal

Bring `README.md` and the AADLC artefacts into alignment with the current state
of the repository. Specific gaps to close:

1. The `--full` flag on the `info` command is unmentioned in the README.
2. The JSON output structure of `info --format json` is undocumented.
3. The `create <path>` positional argument and its path-resolution behaviour are
   not described.
4. `src/formatters/info.ts` (introduced in phase-04) is absent from the source
   layout in `.github/aadlc/memory.md`.
5. No invariant captures the formatter module's contract.

No application behaviour is changed.

---

## Acceptance Criteria

1. `README.md` documents the `--full` flag for the `info` command.
2. `README.md` documents both output formats of `info`:
   - **text** (default): human-readable coloured output to stdout.
   - **json**: single-line JSON with fields `node`, `arch`, `cwd`,
     `memoryUsage`, and (when `--full` is `true`) `processConfig`.
3. `README.md` documents the `create <path>` positional argument, including the
   behaviour that relative paths are resolved against `process.cwd()` and
   absolute paths pass through unchanged.
4. All README usage examples are syntactically correct and use the actual
   binary name `cli-typescript-starter` or the dev invocation
   `pnpm start <command>`.
5. `.github/aadlc/memory.md` source layout table includes
   `src/formatters/info.ts` with an accurate description.
6. `.github/aadlc/invariants.yml` contains a new invariant (`INV-011`) that
   captures the formatter module's contract (output-format logic is isolated in
   `src/formatters/info.ts`; the `info` command handler must not call
   PicoColors functions directly).
7. No application source file, test file, benchmark file, or build/lint
   configuration file is modified.
8. `pnpm compile` exits 0 (unchanged – confirms no source was touched).
9. `pnpm test` exits 0 (unchanged – confirms no behaviour was altered).

---

## Scope

### In scope

- **`README.md`**
  - Add `--full` / `-f` flag description to the `info` command entry in
    "Sample Commands".
  - Extend the `info` entry to describe both `--format text` (default,
    human-readable) and `--format json` (machine-readable, single-line JSON)
    output modes, listing the JSON fields.
  - Update the `create` command entry to mention the required `<path>`
    positional argument, its default value (`cli-typescript-starter`), and the
    relative-path resolution rule.
  - Verify that all shell examples in "Getting Started" are accurate against
    current source (no fixes unless an example is factually wrong).

- **`.github/aadlc/memory.md`**
  - Add `src/formatters/info.ts` row to the "Source layout" section with
    description: `Output formatting functions for the info command`.

- **`.github/aadlc/invariants.yml`**
  - Append `INV-011` describing the formatter isolation contract:
    - `id: INV-011`
    - `description`: Output formatting for the `info` command is implemented in
      `src/formatters/info.ts`. The `info` command handler must not import or
      call PicoColors functions directly; it must delegate to
      `formatInfoText` or `formatInfoJson`.
    - `scope: formatting`
    - `evidence: src/formatters/info.ts, src/commands/info.ts`

### Out of scope (explicit non-goals)

- Any changes to application source code (`src/`, `bin/`).
- Any changes to test files.
- Any changes to benchmark prompts (`benchmark/`).
- Any changes to build, lint, or formatting configuration (`tsconfig.json`,
  `jest.config.js`, `tsup.config.ts`, `.eslintrc*`, `.prettierrc*`,
  `package.json`).
- Adding new commands or modifying command behaviour.
- Changing `trust-boundaries.md` (no new trust-boundary decisions arise from
  documentation changes).
- Adding prose beyond what is needed to close the identified gaps (no tutorial
  expansion, no new sections).

---

## Files Expected to Change

| File | Change |
|---|---|
| `README.md` | Add `--full` flag, JSON output fields, `create <path>` argument docs |
| `.github/aadlc/memory.md` | Add `src/formatters/info.ts` to source layout |
| `.github/aadlc/invariants.yml` | Append `INV-011` (formatter isolation) |

---

## Files That Must Not Change

- `src/commands/info.ts`
- `src/commands/greeting.ts`
- `src/commands/create.ts`
- `src/commands/index.ts`
- `src/formatters/info.ts`
- `src/index.ts`
- `src/logger.ts`
- `bin/run.ts`
- `bin/run`
- All test files (`src/**/*.test.ts`)
- `package.json`
- `tsconfig.json`
- `jest.config.js`
- `tsup.config.ts`
- `.eslintrc*` / `eslint.config.*`
- `.prettierrc*`
- `.github/aadlc/trust-boundaries.md`
- `.github/aadlc/plans/` (all existing plan files)
- All `benchmark/` files
- `.github/copilot-instructions.md`

---

## Validation Commands

Run these after completing all changes. All must exit with code 0.

```sh
pnpm compile   # TypeScript type-check – confirms no source files were altered
pnpm test      # Jest – confirms no behaviour was changed
```

Manual spot-checks (informational, not gated):

```sh
# Verify info command text output matches README description
pnpm start info --format text --full

# Verify info command JSON output matches documented fields
pnpm start info --format json --full

# Verify info command JSON omits processConfig when --full is false
pnpm start info --format json --no-full

# Verify create command default path behaviour
pnpm start create --help
```

---

## Review Checklist

- [ ] `README.md` "Sample Commands" section documents `--full` / `-f` for the
      `info` command.
- [ ] `README.md` lists the JSON output fields: `node`, `arch`, `cwd`,
      `memoryUsage`, and conditionally `processConfig` (when `--full` is set).
- [ ] `README.md` documents `create <path>` positional argument, its default
      (`cli-typescript-starter`), and the relative-path resolution rule.
- [ ] All shell examples in `README.md` use `cli-typescript-starter` or
      `pnpm start` (no incorrect binary name or hypothetical commands).
- [ ] `.github/aadlc/memory.md` source layout includes `src/formatters/info.ts`
      with an accurate description.
- [ ] `.github/aadlc/invariants.yml` contains `INV-011` with the correct `id`,
      `description`, `scope`, and `evidence` fields.
- [ ] No application source file has been modified (verify with `git diff src/`
      and `git diff bin/`).
- [ ] No test file has been modified (`git diff '*.test.ts'`).
- [ ] No benchmark file has been modified (`git diff benchmark/`).
- [ ] `pnpm compile` exits 0.
- [ ] `pnpm test` exits 0.
- [ ] Diff is small and reviewable (target: ≤ ~40 lines changed across all
      files; no bulk rewrites).

---

## Expected Deliverables

1. **`README.md`** – updated "Sample Commands" section accurately describing
   `info` (with `--full` and both `--format` modes including JSON field list)
   and `create` (with `<path>` argument and path-resolution behaviour).
2. **`.github/aadlc/memory.md`** – source layout table includes
   `src/formatters/info.ts`.
3. **`.github/aadlc/invariants.yml`** – `INV-011` appended, capturing the
   formatter isolation contract.
4. Evidence of passing validation: output confirming `pnpm compile` and
   `pnpm test` both exit 0.
