# Current PR Contract

This file describes what the active pull request is expected to deliver.
It is reset at the start of each phase.

## Phase

00 – Hydration

## Objective

Populate AADLC artefacts reflecting the repository's current state.
No application behaviour changes.

## Deliverables

| Artefact | Path | Status |
|---|---|---|
| Copilot instructions | `.github/copilot-instructions.md` | ✅ created |
| Memory | `.github/aadlc/memory.md` | ✅ created |
| Trust boundaries | `.github/aadlc/trust-boundaries.md` | ✅ created |
| Invariants | `.github/aadlc/invariants.yml` | ✅ created |
| PR contract | `.github/aadlc/current-pr-contract.md` | ✅ created |

## Constraints

- No modifications to `src/`, `bin/`, `package.json`, or any application file.
- No new dependencies introduced.
- No tests added or removed.

## Acceptance criteria

- [ ] Repository understanding is documented in memory.md.
- [ ] Trust boundaries are identified in trust-boundaries.md.
- [ ] Invariants reflect actual repository behaviour in invariants.yml.
- [ ] No application behaviour changes.
- [ ] Build, lint, and tests remain green.
