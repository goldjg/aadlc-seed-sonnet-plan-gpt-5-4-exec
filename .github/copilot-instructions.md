# Copilot Instructions

## Repository

This is `cli-typescript-starter`, a CLI application scaffold built with TypeScript and Node.js.

## Stack

- **Language:** TypeScript (Node 20 target)
- **CLI framework:** Yargs
- **Logger:** Consola
- **Terminal colours:** PicoColors
- **Build:** TSUP (`pnpm build`)
- **Tests:** Jest (`pnpm test`)
- **Lint:** ESLint (`pnpm lint`)
- **Format:** Prettier (`pnpm format`)
- **Commit convention:** Conventional Commits (enforced by commitlint + Husky)

## Structure

```
bin/         CLI entry points (run.ts for dev, run for prod)
src/
  commands/  One file per command (info, greeting, create)
  index.ts   Re-exports commands
  logger.ts  Shared Consola logger instance
```

## Command pattern

Every command module must export:
- `command` – yargs command string
- `describe` – one-line description
- `aliases` – array of short aliases
- `builder(yargs)` – option/positional definitions
- `handler(argv)` – async command logic

## AADLC

This repository is under AADLC benchmark measurement. AADLC artefacts live in `.github/aadlc/`.
Do not modify application source code when working on AADLC artefacts only.
