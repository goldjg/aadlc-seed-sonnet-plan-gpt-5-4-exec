# Execution Plan: Phase 06 – Review Hardening

## Goal

Perform a review-hardening pass over all prior benchmark work (phases 01–05).
Identify and fix correctness issues, documentation gaps, missing validation,
maintainability concerns, and contract violations. Record every finding.
Make only the minimal changes required to close confirmed issues; do not
introduce new features or opportunistic refactoring.

---

## Acceptance Criteria

1. All prior benchmark phases remain valid: no phase's deliverables are
   regressed or contradicted.
2. `pnpm test` exits 0 (all Jest tests pass).
3. `pnpm compile` exits 0 (TypeScript type-check succeeds).
4. `pnpm lint` exits 0 (ESLint reports no errors).
5. All documented findings are recorded in
   `.github/aadlc/plans/phase-06-findings.md`.
6. Every finding is classified as: **Fixed**, **Accepted risk**, or
   **No action required** – with a one-line justification.
7. The diff is minimal and justified; no file is changed without a
   corresponding finding entry.

---

## Scope

Review the following artefacts against the PR contract, memory, invariants,
and trust boundaries:

| Area | Files to review |
|---|---|
| Application source | `src/commands/info.ts`, `src/commands/greeting.ts`, `src/commands/create.ts`, `src/commands/index.ts`, `src/formatters/info.ts`, `src/index.ts`, `src/logger.ts` |
| Entry point | `bin/run.ts` |
| Tests | `src/**/*.test.ts` |
| Documentation | `README.md` |
| AADLC artefacts | `.github/aadlc/memory.md`, `.github/aadlc/invariants.yml`, `.github/aadlc/trust-boundaries.md`, `.github/aadlc/current-pr-contract.md` |
| Prior plans | `.github/aadlc/plans/phase-01-cli-feature.plan.md` through `phase-05-docs.plan.md` |

For each area, check:

- **Correctness** – does the implementation match its plan's acceptance criteria?
- **Completeness** – are all deliverables from each plan present?
- **Contract** – do command modules satisfy INV-003 (command shape)?
- **Invariant compliance** – do all invariants (INV-001 through INV-011) hold?
- **Trust boundary alignment** – does code handling untrusted input (argv, env,
  giget) match the decisions recorded in `trust-boundaries.md`?
- **Documentation accuracy** – does `README.md` accurately describe the current
  behaviour of every command?
- **Test coverage** – are the test cases listed in phase-01 and phase-03 plans
  actually present and passing?
- **Missing validation** – any code path that accepts untrusted input without
  the validation described in the respective plan?

---

## Explicit Non-Goals

- Do not add new commands or new command options.
- Do not add new runtime dependencies.
- Do not alter build, lint, or formatter configuration
  (`tsconfig.json`, `jest.config.js`, `tsup.config.ts`, `.eslintrc*`,
  `.prettierrc*`, `package.json`).
- Do not expand test coverage beyond what is required to close a confirmed
  finding; do not add speculative tests.
- Do not alter `benchmark/prompts/*` files.
- Do not alter any existing plan file (phases 01–05).
- Do not perform opportunistic refactoring beyond what is required to resolve a
  confirmed finding.
- Do not add prose or documentation beyond what is needed to close a confirmed
  gap.

---

## Files Expected to Change

| File | Condition for change |
|---|---|
| `.github/aadlc/plans/phase-06-findings.md` | **Always** – findings log must be created |
| `src/commands/info.ts` | Only if a correctness or contract violation is confirmed |
| `src/formatters/info.ts` | Only if a correctness issue is confirmed |
| `src/**/*.test.ts` | Only if a missing test is confirmed as a finding from a prior plan |
| `README.md` | Only if a documentation inaccuracy is confirmed |
| `.github/aadlc/memory.md` | Only if a factual inaccuracy is confirmed |
| `.github/aadlc/invariants.yml` | Only if an invariant is incorrect or missing per confirmed evidence |
| `.github/aadlc/current-pr-contract.md` | Only if it needs to be updated to phase 06 |

---

## Files That Must Not Change

| File | Reason |
|---|---|
| `bin/run.ts` | Entry point invariant (INV-001); not in scope for review fixes |
| `src/commands/greeting.ts` | No known issues; out of scope unless finding confirmed |
| `src/commands/create.ts` | No known issues; out of scope unless finding confirmed |
| `src/commands/index.ts` | Command registration invariant (INV-002) |
| `src/logger.ts` | Shared logger invariant (INV-004) |
| `src/index.ts` | Out of scope |
| `package.json` | No dependency or script changes permitted |
| `tsconfig.json` | Build invariant (INV-006) |
| `jest.config.js` | Test invariant (INV-005) |
| `tsup.config.ts` | Packaging invariant (INV-010) |
| `.github/aadlc/trust-boundaries.md` | No new trust-boundary decisions arise from review |
| `.github/aadlc/plans/phase-01-*.md` through `phase-05-*.md` | Prior plans must not be altered |
| `benchmark/prompts/*` | Benchmark prompts must not be modified |
| `.github/copilot-instructions.md` | Out of scope |

---

## Validation Commands

Run these in order after all changes. All must exit with code 0.

```sh
pnpm compile    # TypeScript type-check – zero errors required
pnpm lint       # ESLint – zero errors required
pnpm test       # Jest – all tests must pass
```

Verify no unintended source changes:

```sh
git diff src/
git diff bin/
git diff benchmark/
```

---

## Review Checklist

- [ ] `phase-06-findings.md` has been created and lists every finding.
- [ ] Every finding has a classification: **Fixed**, **Accepted risk**, or
      **No action required**.
- [ ] Every classification has a one-line justification.
- [ ] Every changed file has a corresponding finding entry.
- [ ] No file is changed that does not have a corresponding finding entry.
- [ ] INV-001 through INV-011 all hold in the final state of the repository.
- [ ] No command module is missing any of the five required exports
      (INV-003: `command`, `describe`, `aliases`, `builder`, `handler`).
- [ ] No command creates its own logger instance (INV-004).
- [ ] `src/commands/info.ts` delegates text/JSON formatting to
      `src/formatters/info.ts` and does not call PicoColors directly (INV-011).
- [ ] `bin/run.ts` calls `config()` (dotenv) before registering commands (INV-008).
- [ ] All README examples use the correct binary name and are accurate against
      current source.
- [ ] `pnpm compile` exits 0.
- [ ] `pnpm lint` exits 0.
- [ ] `pnpm test` exits 0.
- [ ] Diff is minimal: every changed line is traceable to a finding.
- [ ] Commit message follows Conventional Commits format
      (e.g. `fix(review): resolve phase-06 hardening findings`).

---

## Expected Deliverables

1. **`.github/aadlc/plans/phase-06-findings.md`** – required, always created.
   Must contain:
   - A table of all findings with columns: `ID`, `Area`, `Description`,
     `Classification`, `Justification`.
   - A summary section stating total findings, how many were fixed, and how
     many were accepted or no-action.

2. **Targeted source or documentation fixes** – zero or more, each justified
   by an entry in `phase-06-findings.md`. Examples of legitimate fix types:
   - A missing test case that was explicitly required by a prior plan.
   - A README example that names the wrong binary or describes incorrect
     behaviour.
   - A stale invariant evidence reference pointing to a file that has since
     been renamed.
   - A command handler calling PicoColors directly in violation of INV-011.

3. **Passing CI** – evidence that `pnpm compile`, `pnpm lint`, and `pnpm test`
   all exit 0 after all changes.
