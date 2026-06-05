# AADLC Memory

Durable architectural truths about this repository.

## Identity

| Key | Value |
|---|---|
| Repository | cli-typescript-starter |
| Upstream | kucherenko/cli-typescript-starter |
| Purpose | Scaffold for building TypeScript CLI applications |
| License | MIT |

## Technology stack

| Layer | Technology | Version constraint |
|---|---|---|
| Language | TypeScript | ^5.4 |
| Runtime | Node.js | 20 (via @tsconfig/node20) |
| CLI parsing | Yargs | ^17 |
| Environment | Dotenv | ^16 |
| Terminal colours | PicoColors | ^1 |
| Logging | Consola | ^3 |
| Template download | giget | ^1 |
| Build | TSUP | ^8 |
| Test runner | Jest (ts-jest) | ^29 |
| Linter | ESLint + @typescript-eslint | ^8 / ^6 |
| Formatter | Prettier | ^3 |
| Git hooks | Husky | ^9 |
| Commit convention | commitlint + commitizen | ^18 / ^4 |
| Release | semantic-release | ^23 |

## Entry points

| Entry | Purpose |
|---|---|
| `bin/run.ts` | Development entry (ts-node) |
| `bin/run` | Production entry (compiled dist) |

## Source layout

```
src/
  index.ts          Re-exports `commands` array from src/commands
  logger.ts         Shared Consola logger instance
  commands/
    index.ts        Assembles and exports the commands array
    info.ts         `info` command – prints Node/system info
    greeting.ts     `greeting` command – interactive prompt demo
    create.ts       `create` command – scaffolds new project via giget
```

## Command contract

Every command module must export:
- `command` – yargs command string (may include positional placeholders)
- `describe` – one-line human description
- `aliases` – array of short string aliases
- `builder(yargs: Argv): Argv` – option/positional definitions
- `handler(argv)` – async function containing command logic

## Scripts

| Script | Purpose |
|---|---|
| `pnpm build` | Bundle with TSUP |
| `pnpm compile` | Type-check only (tsc) |
| `pnpm test` | Run Jest unit tests |
| `pnpm lint` | ESLint check |
| `pnpm format` | Prettier check |

## CI/CD

Semantic-release runs on merge to `main`. It reads conventional commit messages to determine semver bump, generate release notes, publish to npm, and create a GitHub release. Requires `NPM_TOKEN` secret.

## AADLC benchmark context

This repository is one of several measured branches in the AADLC model benchmark. The benchmark measures useful engineering work per AI credit. AADLC artefacts must not alter application behaviour.
