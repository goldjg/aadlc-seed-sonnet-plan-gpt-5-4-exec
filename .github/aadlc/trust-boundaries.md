# Trust Boundaries

Identifies the trust boundaries relevant to this repository.

## Boundary map

| Boundary | Direction | Trust level | Notes |
|---|---|---|---|
| CLI argv | Inbound → process | Untrusted | Provided by end user; parsed by Yargs but not sanitised further |
| Environment variables (`.env`) | Inbound → process | Semi-trusted | Loaded by Dotenv at startup; controlled by operator of the environment |
| `giget` / GitHub template download | Outbound → internet | External | `create` command fetches `gh:kucherenko/cli-typescript-starter`; integrity is not verified locally |
| npm registry (install time) | Outbound → internet | External | Dependencies resolved at install time via `pnpm`; lockfile (`pnpm-lock.yaml`) pins exact versions |
| Node.js process internals | Internal | Trusted | `process.version`, `process.arch`, `process.cwd()`, `process.memoryUsage()` read and logged |
| GitHub Actions CI | Outbound → GitHub | Trusted (operator-controlled) | `NPM_TOKEN` secret must be set; semantic-release publishes to npm from CI |
| Husky git hooks | Local developer machine | Trusted (developer-controlled) | Pre-commit and commit-msg hooks run ESLint, Prettier, and commitlint |
| Consola logger output | Outbound → stdout/stderr | Trusted | Writes to terminal; no external network calls |

## Key observations

- The `create` command downloads a remote template without checksum or signature verification. An attacker who compromises `kucherenko/cli-typescript-starter` on GitHub could deliver malicious code to users.
- Argv inputs are passed directly to `giget` as a filesystem path after a `join(process.cwd(), value)` coercion. Absolute paths bypass the coercion and reach `giget` unmodified.
- Environment variables are not validated; any variable accepted by downstream libraries is implicitly trusted once loaded.
- The npm publish secret (`NPM_TOKEN`) is the highest-privilege credential in scope; it must only exist in the GitHub Actions environment.
