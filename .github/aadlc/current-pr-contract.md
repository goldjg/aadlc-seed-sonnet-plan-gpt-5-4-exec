# Current PR Contract

This file describes what the active pull request is expected to deliver.
It is reset at the start of each phase.

## Phase

06 – Review Hardening

## Objective

Perform a review-hardening pass on benchmark phases 01–05.
Fix only confirmed correctness, documentation, validation, or contract issues.
Record all findings and keep the diff minimal and justified.

## Deliverables

| Artefact | Path | Status |
|---|---|---|
| Findings log | `.github/aadlc/plans/phase-06-findings.md` | ✅ required |
| Targeted review fixes | repository files justified by findings | ✅ conditional |
| PR contract | `.github/aadlc/current-pr-contract.md` | ✅ updated |

## Constraints

- Make only minimal necessary changes.
- No new features or opportunistic refactoring.
- No new dependencies introduced.
- Do not modify benchmark prompts.
- Every changed file must have a corresponding finding entry.

## Acceptance criteria

- [ ] Findings are documented in `.github/aadlc/plans/phase-06-findings.md`.
- [ ] Every finding is classified as Fixed, Accepted risk, or No action required.
- [ ] All prior benchmark phases remain valid.
- [ ] `pnpm compile` remains green.
- [ ] `pnpm lint` remains green.
- [ ] `pnpm test` remains green.
