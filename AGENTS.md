# @clevercloud/client

JavaScript REST client for the Clever Cloud APIs, published on npm as `@clevercloud/client`.
TypeScript, ESM only, run in Node.js (22 and later) and in browsers.
Node and pnpm versions are pinned in `mise.toml`.

This file is the instruction set for AI coding agents.

## Always do this

- **Before saying the work is done, run `pnpm check` and fix what it reports.**
  Claude Code also lints and formats each file it changes with Edit or Write (`.claude/hooks/lint-format.ts`), but the hook does not typecheck nor run the tests.
- **Before adding or fixing a command, read [docs/writing-commands.md](docs/writing-commands.md).**
  It is the reference for the conventions of the commands: reading the backend source first and keeping `docs/command-backend-source-map.csv` up to date, file layout, naming, the `undefined`-over-`null` rule, dates and durations, transforms, error codes and JSDoc.
- **Before writing a commit message or a changeset, read [docs/commits-and-changelog.md](docs/commits-and-changelog.md).**
  Every commit carries a scope from its taxonomy.
- **Never add a dependency without discussing it first.**
- **Never read, print or commit `.env`.**
  It holds the credentials of the e2e test users.

## Writing

These rules apply to Markdown files (except `CHANGELOG.md`), commit messages and changesets.

- One sentence per line, never hard-wrapped.
- Short sentences, no long prose.

The ADRs live in `docs/adr/`: read them to know why something is the way it is.

## Commands

```bash
# Dev
pnpm install                         # Install dependencies
pnpm build                           # Build dist/ with tsc

# Quality
pnpm lint                            # Oxlint
pnpm format                          # Oxfmt
pnpm typecheck                       # TypeScript 7 `tsc`, the native compiler
pnpm test                            # Unit tests, Node.js and browser (Vitest, Playwright Chromium)
pnpm test:unit:node                  # Unit tests, Node.js only (also `:browser`, and `:watch` variants)
pnpm test:e2e                        # E2E tests against the real API, needs the credentials (see `CONTRIBUTING.md`)
pnpm check                           # lint, format, typecheck and unit tests

# Release
pnpm changeset                       # Record a change (bump + changelog entry)
```

**Never run unasked:** `pnpm release`, `changeset version`, `changeset publish`, `npm publish`.
The release workflow runs them (`.github/workflows/release.yml`), and they publish to npm.

## Layout

- **`src/lib/`**: the base of every client: `CcClient`, auth, commands, requests, SSE streams, errors.
- **`src/clients/{client}/`**: one client per API (`cc-api`, `cc-api-bridge`, `redis-http`), its commands under `commands/{domain}/`, a `.ts` file and a `.types.ts` file per command.
- **`src/utils/`**: standalone helpers, published under `@clevercloud/client/utils/*.js`.
- **`esm/`**: the legacy functional client, still published and consumed: a break there is a major.
- **`test/unit/`** and **`test/e2e/`**: Vitest specs, mirroring the tree of the sources.
- **`tasks/`**: scripts of the repository.

## Gotchas

- **Relative imports use the `.ts` extension.**
  `tsc` rewrites them to `.js` in `dist/`, and Oxlint rejects `.js`.
- **The same spec runs in Node.js and in the browser.**
  `vitest.config.ts` defines four projects: `node-unit`, `browser-unit`, `node-e2e`, `browser-e2e`.
  Name a spec `*.node.spec.ts` or `*.browser.spec.ts` to restrict it to one runtime.
- **Unit tests hit a mock API, from `@clevercloud/doublure`.**
  Specs use its `doublureHooks` (`@clevercloud/doublure/testing`), and the browser reaches it through its Vitest plugin.
  The mock server is shared, so the specs run one file at a time.
- **The `#dom-parser` subpath import resolves to `dist/` for consumers.**
  The `clever-client-source` condition points it back to `src/`: `tsconfig.json` and `vitest.config.ts` set it.
- **The typecheck does not catch a Node.js API in browser code, nor the reverse.**
  `tsconfig.json` loads both the DOM and the Node types, and the same sources run in both runtimes.
  Code for one runtime sits in its own file: `*.node.ts`, `*.browser.ts`, the stores.
