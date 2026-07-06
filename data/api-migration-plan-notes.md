# API migration plan — methodology & key findings

Companion notes for `data/api-migration-plan.csv`. The CSV has one row per Clever Cloud API
call site found across `console3`, `clever-tools`, and `clever-components` (648 rows), with
columns: `project, file, line, method, path, mechanism, current_reference, target_command,
command_creation_required, simplification_notes`.

## How the data was produced

1. **Baseline scan**: `tasks/lib/api-analyze.ts` (run via `pnpm api-usage-analyze`) statically
   parses every `.js` file in the three sibling projects and detects two call shapes:
   - `old legacy client (console3-local API.x.y.get() tree)` — the bespoke `API.foo.bar.get()`
     call tree built by `console3/src/clever-client/legacy-client.js`. Only found in console3.
     4 syntactic false positives (unrelated `Git.get()` calls in clever-tools) were excluded.
   - `legacy client (@clevercloud/client esm/api/*)` — `someApiFn(...).then(sendToApi)`, resolved
     by following the import back to the function's JSDoc `@endpoint`/comment in `node_modules`.
2. **Heuristic gaps closed by hand**: the static scanner's pattern match is narrow (it can't see
   through `Promise.all`, extra `.then()` links, arrow-wrapped callbacks, aliased `sendToApi`
   wrappers, or `this.method()` calls). Diffing every raw `sendToApi` occurrence against what the
   scanner caught (with a same-file line-proximity window, since the scanner records a call's
   *start* line, not the line the token appears on) surfaced ~10 additional real call sites,
   added by hand.
3. **"Internal implementation" discovery**: the scanner also emits a warning whenever a `.then()`-
   chained function isn't imported from `@clevercloud/client` (`cannot find import to X`). Every
   one of those (59 call sites) turned out to be a project-local reimplementation of the
   `esm/api/*` function shape — e.g. clever-tools' `src/clever-client/{k8s,ng,operators,drains,
   auth-bridge}.js`, and one-off copies duplicated per-component inside clever-components
   (`getOperator`, `getCellarInfo`, `getKubeInfo`, etc., several marked `// FIXME: remove and use
   the clever-client call from the new clever-client`). Their method+path was read directly from
   the JSDoc/`Promise.resolve({method, url})` in each definition.
4. **Hand-built requests with no named function**: a further 13 call sites (mostly
   `cc-cellar-explorer.client.js`, which implements all 9 Cellar bucket/object endpoints inline)
   plus 1 raw `fetch()` call (console3's `server/crisphash.js`, a Node backend route, not the
   browser app) were found by manual inspection and added the same way.
5. **"New client" (Command pattern) usage**: a separate AST pass looked for
   `new XCommand(...)` where `XCommand` is imported from `@clevercloud/client/cc-api-commands/*`.
   88 call sites — 85 in clever-components, 3 in console3, **0 in clever-tools**.
6. **Cross-referencing to find the target command**: originally this used
   `data/endpoints/commands/cc-api.csv`, but that file turned out to be significantly stale —
   **47 of the 88 "new client" usages already in the codebase aren't listed in it at all**
   (`GetZoneCommand`, the whole `NetworkGroup` family, all the per-provider Operator commands...).
   So the primary source of truth is now the `@endpoint [METHOD] /path` JSDoc comment extracted
   directly from every `src/clients/*/commands/**/*-command.ts` file (223 of 224 files have one).
   `cc-api.csv` is still used as a secondary source for two things it captures that source code
   doesn't: `Composite`/`Comment` annotations (merge/simplification notes) and the `PERSONAL_ORGA`
   marker (a `/v2/self/...` endpoint served by the same command as its `/v2/organisations/{id}/...`
   sibling, via the client's automatic owner-id resolution — resolved here by looking up that
   sibling path instead).

## Key structural findings (the important part)

- **Five endpoint domains have no command at all**, confirmed absent from both the OpenAPI-derived
  catalog (`cc-api.csv`) and the command source tree:
  - **Kubernetes** (16 endpoints) — clusters, node groups, quota/usage, kubeconfig, version
    check/update. Used by clever-tools (`src/clever-client/k8s.js`) and duplicated again inside
    console3 (`cc-configure-kubernetes.smart.js`, `various.js`) and clever-components
    (`cc-addon-header/info.smart-kubernetes.js`).
  - **Cellar** (13 endpoints) — bucket/object CRUD + credentials, entirely hand-built in
    `clever-components/src/components/cc-cellar-explorer/cc-cellar-explorer.client.js` and
    duplicated in `cc-addon-*-cellar.js` files.
  - **Drains v4** (6 endpoints) — clever-tools' `src/clever-client/drains.js` hits
    `/v4/drains/organisations/{id}/resources/{resourceId}/drains...`. **Careful**: a `LogDrain`
    command family already exists in source, but targets
    `/v4/drains/organisations/{id}/applications/{appId}/drains...` — `resources` vs
    `applications`. This is either a genuine second/broader endpoint or the command's `@endpoint`
    doc is stale; verify against the real API before deciding whether to reuse or extend it.
  - `GET /v2/self/tokens/current` — one isolated gap (current OAuth token info).
  - `POST /v4/billing/organisations/{id}/applied-coupons` used to look like a gap too but an
    `ActivateCouponCommand` already exists for it — just missing from `cc-api.csv`.
- **Generic "operator" functions have no generic command by design.** clever-tools/clever-components
  each hand-roll `getOperator(provider, realId)`, `rebootOperator`, `rebuildOperator`,
  `versionCheck`, `versionUpdate`, `ngEnableOperator`, `ngDisableOperator`, `getOtoroshiConfig`
  against `/v4/addon-providers/addon-{provider}/addons/{realId}...` for an arbitrary provider
  string. The new client has **one dedicated command per addon provider** instead (e.g.
  `GetOtoroshiInfoCommand`, `GetKeycloakInfoCommand`, `RebootMatomoCommand`,
  `CheckMetabaseVersionCommand`...), for Otoroshi/Keycloak/Metabase/Matomo/Pulsar. Migrating these
  call sites isn't "create a command" — it's "switch on the provider string and call the matching
  command"; any provider outside that list still needs a new command. The CSV flags these rows
  with `command_creation_required = "no for known providers (dispatch by provider); yes for any
  other provider"` and lists the available per-provider commands in `simplification_notes`.
- **NetworkGroup linking** (`createNg`/`deleteNg`, i.e. attaching an addon to a network group via
  `/v4/addon-providers/addon-{provider}/addons/{realId}/networkgroup`) falls in the same bucket —
  `CreateOtoroshiNetworkGroupCommand`/`CreateKeycloakNetworkGroupCommand` etc. already exist
  per-provider. `searchNetworkGroupOrResource` (clever-tools) already has an exact match,
  `SearchNetworkGroupCommand` — not a gap, just missing from `cc-api.csv`.
- **`cc-api.csv` itself needs a refresh.** It's the single source most tooling in this repo
  (`endpoints-list`, `endpoints-analyze`) points people at, but this investigation found it stale
  in both directions: missing >50% of the "new client" commands actually in use, and in at least
  one case (`ListLogDrain` et al.) pointing at a `/v2` endpoint the command no longer targets
  (the source now targets `/v4/drains/.../applications/...`). Worth regenerating/reviewing
  independently of this migration.

## Known gaps in this pass (not exhaustively re-verified)

- A handful of long-tail `sendToApi` call sites using non-standard wrapper names
  (`sendToApiWithConfig`, a locally-bound `sendWithCredentials` variable) were spot-checked rather
  than exhaustively re-scanned; the ones checked (clever-tools `login.command.js`, `profile.js`)
  follow the standard esm-legacy-client pattern and are included, but there could be one or two
  more of this shape not yet in the CSV.
- Rows with `target_command` starting `UNKNOWN` or `command_creation_required` = `unclear - verify
  manually` should be treated as "needs a human look", not as a settled verdict — path
  normalization between the static scanner (source-text reconstruction) and the OpenAPI/source
  conventions (`:XXX` placeholders) mostly lines up but isn't guaranteed to in every edge case.
