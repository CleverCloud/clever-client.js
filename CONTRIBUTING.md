# How to contribute?

##  We have precise rules for commit message format

Commit messages must respect [conventional commit](https://www.conventionalcommits.org).

Possible types are `fix:`, `feat:`, `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`.

The scope should be the name of the component affected.
If many components are affected, consider the following options:
* split into multiple commits
* use the main module.
* avoid specifying any scope and add some details instead. However, you must understand that details won't be dumped into the CHANGELOG.

If none of these options suits your need, you can follow [this how-to](https://github.com/googleapis/release-please#what-if-my-pr-contains-multiple-fixes-or-features) that will let you generate multiple CHANGELOG entries with one single commit.

To help you respect the rules, you should install a commit linter with the following command:

```shell
cd ${PATH_TO_THE_REPOSITORY_ROOT}
git config core.hooksPath '.githooks'
```

## How to test

Tests run on [Vitest](https://vitest.dev). The same `*.spec.js` files are executed both in **Node.js** and in a **real browser** (Vitest browser mode, powered by Playwright/Chromium). This is configured as four projects in `vitest.config.js`:

| Project        | Kind | Runtime |
|----------------|------|---------|
| `node-unit`    | unit | Node.js |
| `browser-unit` | unit | browser |
| `node-e2e`     | e2e  | Node.js |
| `browser-e2e`  | e2e  | browser |

There are two kinds of tests:

* **Unit tests** (`test/unit/`) hit a mock API (provided by [`@clevercloud/doublure`](https://www.npmjs.com/package/@clevercloud/doublure)). They need no credentials and are what `npm run test` runs.
* **End-to-end tests** (`test/e2e/`) hit the **real** Clever Cloud API. They log real test users in, exercise the API, then log them out. They require credentials (see below).

The most common commands:

```shell
npm run test           # all unit tests (Node + browser)
npm run test:unit:node # unit tests, Node only
npm run test:e2e       # e2e tests, Node + browser (needs the env vars below)
npm run test:e2e:node  # e2e tests, Node only
```

See `package.json` for the full list of `test:*` scripts (per-runtime and watch variants).

Browser projects need Playwright's Chromium installed once:

```shell
npx playwright install chromium
```

Specs that must run in a single environment use the `*.node.spec.js` / `*.browser.spec.js` naming convention.

### Mandatory environment variables (e2e)

End-to-end tests authenticate against the real API, so they need credentials. These are **not** required for unit tests.

Provide them however you like. Locally, the simplest way is a `.env` file at the repo root: it is loaded automatically by `mise` (see `mise.local.toml`, which points `_.file` at `.env`). You can also export them in your shell or, on CI, inject them from the secrets store. The full list:

| Variable                | Purpose                                                   |
|-------------------------|-----------------------------------------------------------|
| `OAUTH_CONSUMER_KEY`    | OAuth consumer key used to drive the login (OAuth) dance. |
| `OAUTH_CONSUMER_SECRET` | OAuth consumer secret matching the key above.             |

Two test users must also be defined. They are declared in `test/lib/e2e-test-users.js`, and each field is read from the environment:

**`test-user-without-github`** — a user with no GitHub account linked:

| Variable                               | Purpose                                                                 |
|----------------------------------------|-------------------------------------------------------------------------|
| `TEST_USER_WITHOUT_GITHUB_EMAIL`       | Login email.                                                            |
| `TEST_USER_WITHOUT_GITHUB_PASSWORD`    | Login password.                                                         |
| `TEST_USER_WITHOUT_GITHUB_TOTP_SECRET` | TOTP secret, used to generate the MFA code (this user has MFA enabled). |

**`test-user-with-github`** — a user with a GitHub account linked:

| Variable                         | Purpose         |
|----------------------------------|-----------------|
| `TEST_USER_WITH_GITHUB_EMAIL`    | Login email.    |
| `TEST_USER_WITH_GITHUB_PASSWORD` | Login password. |

To add a new test user, declare it in `test/lib/e2e-test-users.js` and wire its fields to new environment variables the same way.

> **Note:** for the Node e2e run, users are logged in **once** in `test/setup/global-setup.node.js`, then their tokens are handed to the test workers via Vitest's `provide`/`inject` (see `test/setup/hydrate-users.node.js`). The browser e2e run logs in through the proxy Vite plugin in `test/setup/e2e-proxy.browser.js`.

### The `TEST_RUNTIME` env var

By default every Vitest command runs every project it is given, i.e. both the Node and the browser variant. `TEST_RUNTIME` is a **local-only escape hatch** to restrict a run to a single runtime:

| Value     | Effect                                                        |
|-----------|---------------------------------------------------------------|
| _(unset)_ | Run all projects (Node **and** browser). This is the default. |
| `node`    | Keep only the `node-*` projects.                              |
| `browser` | Keep only the `browser-*` projects.                           |

How it works (`vitest.config.js`): when `TEST_RUNTIME` is set, the project list is filtered to those whose name starts with `${TEST_RUNTIME}-`. Any other value throws an error.

Why it exists: some IDEs (e.g. WebStorm) run tests straight from the gutter with no `--project` flag, which would run every matching project — and for e2e that means logging the test users in **once per environment**. Setting `TEST_RUNTIME` lets you keep that to a single environment.

Because the `npm run test:*` scripts already pass explicit `--project` flags and CI sets its own projects, `TEST_RUNTIME` only matters for those flagless local runs and leaves CI and the npm scripts unaffected.
