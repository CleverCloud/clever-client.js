# Commits and changelog

A change ships two texts, written for two different readers.

The **commit message** is for whoever works on this repository next — you, in six months, running
`git log` on a file and asking why it looks like that. It talks about the code.

The **changelog entry** is for whoever consumes `@clevercloud/client` — `CHANGELOG.md` is the only
thing they read before upgrading. It talks about their code. Changesets is how the entry gets there;
what follows is about the entry, not the tool.

They are never the same sentence twice. Writing one and pasting it into the other fails one of the
two readers.

## Nothing is a breaking change, for now

> **Temporary.** This section goes away once the new client has consumers to break.

The new client (everything under `src/`) has no stable public surface yet. While that holds, for a
change touching `src/` only:

- Never release a `major` nor a `minor`. Every entry is a `patch`.
- Never use the `!` marker or a `BREAKING CHANGE:` footer in a commit touching the new client.
- Still say what changed and how to adapt. A consumer following the branch needs the migration note
  even when the version number does not warn them.

This does not license silent breakage — it means the version number is not the channel for it yet.
The changelog is, and [Breaking changes](#breaking-changes) applies in full to a `patch` that breaks:
the bump is the only part of it we suspend.

**The legacy client is not covered.** `esm/` is published, documented and consumed today. A break
there is a `major`, its commit carries the `!` marker and the `BREAKING CHANGE:` footer, and none of
the above applies. The suspension exists because the new client has no consumers yet; the old one
does.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint
(`.commitlintrc`, `@commitlint/config-conventional`). Install the hook once:

```shell
git config core.hooksPath '.githooks'
```

The rule that matters: the subject says **why**, not what. The diff already shows what changed.

The mechanics, which commitlint checks: imperative present tense, lowercase after the colon, no final
period, 100 characters at most. A body is optional — write one as soon as the why does not fit in the
subject, separated by a blank line and wrapped at 100 too. Commits are kept as they are written, so
each one has to stand on its own in `git log`.

Agents have a global `commit` skill covering the same ground; the taxonomy below is what it cannot
know.

### Pick the type from the diff, not from the intent

commitlint accepts `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `perf`, `style`
and `revert`. Four of them account for most of the log, and three choices come up again and again:

- **`refactor` vs `fix`/`feat`.** `refactor` means nothing a consumer can observe changed. The moment
  one could tell — a value, a shape, an error, a timing — it is a `fix` or a `feat`, whatever the
  intent behind the change was.
- **`fix` vs `feat`.** `fix` restores what the command already promised, in its types or its
  documentation. `feat` adds surface: a command, an export, an option, a field, an error code.
- **`build` vs `ci` vs `chore`.** `build` is what produces the package — Rollup, tsconfig,
  `package.json`, the publish pipeline. `ci` is what GitHub Actions runs. `chore` is what affects
  neither.

`docs` covers JSDoc as well as the files under `docs/`. Both are documentation; only one of them
ships to consumers, which matters for [the changelog](#when-a-change-needs-one), not for the type.

### Always set a scope

Every commit carries a scope. `feat: add a thing` is not acceptable here even though commitlint
allows it. The one exception is the `chore: release` commit the Changesets action writes — generated,
not authored.

**Reuse an existing scope.** Read `git log --pretty=%s` before inventing one. A scope only earns its
keep by being greppable, and a scope used once is a scope nobody will guess.

The families below derive from the folder tree, so they need no maintenance: a new folder or module
brings its own scope with it, and taking it is not inventing one. Wanting a scope that fits none of
them is — ask first.

Three families cover the published code:

| Scope                | Covers                               | Example              |
|----------------------|--------------------------------------|----------------------|
| `core/{area}`        | The shared base library, `src/lib/`  | `core/stream`        |
| `utils/{area}`       | The standalone helpers, `src/utils/` | `utils/error`        |
| `{client}/{command}` | One command                          | `cc-api/get-zone`    |
| `{client}/{group}`   | Several commands of the same group   | `cc-api/oauth-token` |

#### `core/{area}`

`{area}` is the folder under `src/lib/` — `core/stream` for `src/lib/stream/`, `core/request` for
`src/lib/request/`, and so on. Code sitting at the root of `src/lib/` belongs to the client itself:
`core/client`. The shared declarations in `src/types/` join the family as `core/types`.

#### `utils/{area}`

`{area}` is the module under `src/utils/`, minus its `-utils` suffix — `error-utils.ts` is
`utils/error`, `duration-utils.ts` is `utils/duration`. Modules that never carried the suffix keep
their name whole: `polling.ts` is `utils/polling`, `domain-diag.ts` is `utils/domain-diag`.

#### `{client}/{command}` and `{client}/{group}`

`{client}` is the folder under `src/clients/`: `cc-api`, `cc-api-bridge`, `redis-http`.

The second segment is the **command**, kebab-cased, when the change touches one command:

```
fix(cc-api/get-zone): encode the zone name it puts in its URL
```

It is the **command group** — the folder under `commands/` — when the change touches several
commands of that group:

```
feat(cc-api/oauth-token): tell the two token deletion commands apart
```

A change spanning several groups is usually two commits. If it genuinely is not (a convention
applied across a client), scope it to the client: `refactor(cc-api): ...`.

#### Everything that is not the published code

Same rule one level up: the scope is the folder, or the tool when there is no folder.

| Scope          | Covers                                                            |
|----------------|-------------------------------------------------------------------|
| `legacy`       | The legacy functional client, `esm/`                              |
| `test` / `e2e` | `test/unit/` and `test/e2e/`, and their setup                     |
| `build`        | What produces the package: Rollup, tsconfig, `package.json`       |
| `ci`           | `.github/`                                                        |
| `deps`         | Dependency bumps                                                  |
| `release`      | `.changeset/` configuration and the release pipeline              |
| `data`         | `data/` — the command → source map, the endpoint dumps            |
| `tasks`        | `tasks/`                                                          |
| `adr`          | `adr/`                                                            |

Documentation is the one thing scoped by subject rather than by folder, because `docs/` is flat and
its files are named after what they explain: `docs(commands)` for `writing-commands.md`,
`docs(commits)` for this file. JSDoc is not documentation in that sense — it lives inside a command
and takes that command's scope, `docs(cc-api/get-zone)`.

## Changelog

`CHANGELOG.md` and the releases are driven by
[Changesets](https://github.com/changesets/changesets), independently from commit messages. Writing
an entry means running:

```shell
pnpm changeset
```

It asks for a bump type and a summary, then writes a `.changeset/*.md` file — commit it alongside
the code, CI compiles it into `CHANGELOG.md` at release time. Several entries in one PR? Run it
again, or write the files by hand: a `.changeset/*.md` is frontmatter naming the package and its
bump, a blank line, then the entry. The first line is the title and the rest is the body — no
headings, since the whole entry is nested under a bullet in the changelog.

### When a change needs one

The unit is one consumer-visible change — not one commit, and not one PR. A fix spread over three
commits is one entry; a PR fixing two unrelated things is two.

Nothing in CI enforces this: a change a consumer would notice, shipped without an entry, ships
invisibly. But most commits here are not that one, and inventing an entry for them fills the
changelog with noise. Skip it when there is nothing a consumer could observe:

- tests, CI, build configuration, `tasks/`, `data/`, the files under `docs/`;
- a refactor under `src/` that leaves the public surface and the behaviour identical — the largest
  category in this log. The test is simple: if you cannot name what a consumer would see, there is
  nothing to write for them.

JSDoc is the edge case. It ships in the generated `.d.ts`, so it is the consumer's documentation:
correcting what a field actually holds is a `patch` worth an entry, fixing a typo is not.

### Write for a consumer

The reader is someone using `@clevercloud/client` in an application. They do not know this
repository, they will not open it, and they are reading a changelog to decide whether to upgrade.

**Say what changes for them.**

- A fix: what is better now, from the outside. Not which line was wrong.
- A break: what they need to change in their code.
- A feature: what they can now do that they could not before.

**Never leak internals.** No file paths, no private class names, no "the transform now reads the
payload at the right level", no backend route names. Names a consumer can import — command classes,
exported functions, types, error codes — are the vocabulary; everything behind them is not.

**Be concise.** One line is the target. A consumer scanning a release does not need the
investigation that led to the fix.

- No preamble, no restating the title in the body.
- No paragraph where a sentence does.
- Add a body only when the one-liner leaves the consumer with an unanswered question: what to
  migrate to, which error codes appeared, what the caveat is.

### Bump type

| Bump    | When                                                                   |
| ------- | ---------------------------------------------------------------------- |
| `patch` | A fix, a JSDoc correction, anything a consumer needs no action for     |
| `minor` | A new command, a new export, a new option                              |
| `major` | Anything a consumer must change their code for                         |

Suspended for now — see [the top of this document](#nothing-is-a-breaking-change-for-now). Everything
is `patch` until the new client has a stable surface. The rule below is what a break must say
regardless of the bump it carries.

### Breaking changes

A breaking entry is the one changelog line a consumer cannot skim past, and the only one they will
still be reading when their build fails. Be blunt and be complete. Concision still applies to the
prose — never to the migration.

State three things, in this order:

1. **What breaks.** Name it: the export, the command, the field, the type. A consumer must be able to
   grep their code for it. "Some option handling changed" is not a break statement.
2. **What replaces it**, or that nothing does. If a behaviour changed rather than a name, say what
   the old one did and what the new one does — a consumer who never touches a symbol still breaks.
3. **The migration procedure.** Not a description of it — the procedure. Old code, new code, in that
   order, as code. One block per breaking item.

````markdown
---
'@clevercloud/client': major
---

Rename `GetAppCommand` to `GetApplicationCommand`

The short form was the only command abbreviating its resource.

```diff
-import { GetAppCommand } from '@clevercloud/client/cc-api-commands/application/get-app-command.js';
-const app = await client.send(new GetAppCommand({ appId }));
+import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
+const app = await client.send(new GetApplicationCommand({ applicationId }));
```
````

The migration must be **mechanical**. A consumer should be able to apply it without opening this
repository, without reading the diff, and without asking anyone what was meant. If the change cannot
be reduced to that — a value now rejected that used to be accepted, a field that can now be missing —
say what the consumer has to decide, and what happens if they do nothing.

Never ship:

- ❌ "Adapt your code accordingly."
- ❌ "See the documentation" as the only guidance.
- ❌ A rename with no mention of the old name — that is the string they will search for.
- ❌ Several breaks merged into one paragraph. One item, one migration block.

The commit for a breaking change carries the `!` marker and a `BREAKING CHANGE:` footer, once the
suspension above is lifted.

### Examples

A fix that needs nothing more than its title:

```markdown
---
'@clevercloud/client': patch
---

Encode the zone name `GetZoneCommand` puts in its URL
```

Compare with the commit for the same change, which names the cause because the next person editing
that file needs it:

```
fix(cc-api/get-zone): encode the zone name it puts in its URL

The name was interpolated with a plain template literal instead of `safeUrl`.
```

A change with a list the consumer will look up later:

```markdown
---
'@clevercloud/client': patch
---

Translate the domain creation failures into named error codes:

- `clever.domain.invalid-format`
- `clever.domain.already-used`
- `clever.domain.forbidden`
```

A new capability, with the one thing a consumer cannot guess:

```markdown
---
'@clevercloud/client': minor
---

`GetMetricsCommandInput.interval` / `.span` and `GetWarpTokenCommandInput.ttl` now accept a number of
milliseconds, not only an ISO 8601 string.

Durations on outputs stay ISO 8601 strings. `parseDuration()` from
`@clevercloud/client/utils/duration-utils.js` reads them back as milliseconds.
```

### What not to write

- ❌ `Fix GetZoneCommand` — a title that says nothing the diff does not.
- ❌ `The transform in zone-transform.ts now reads memory at the right payload level` — internals,
  and the consumer cannot act on it.
- ❌ `This release improves the reliability of the domain commands by introducing a new error
  mapping layer which translates the numeric identifiers returned by the legacy v2 endpoints into
  a set of named constants that are now exported…` — three lines where one does.
- ❌ Repeating the commit message verbatim.
