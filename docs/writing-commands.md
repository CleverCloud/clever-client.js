# Writing a command

Conventions every command follows. Deviations in existing code are oversights, not precedents.

## Start from the backend source

Never write or fix a command from an OpenAPI spec, a neighbouring command or a sample response.
Open the route and the DTO. Read:

- **Route** — path and method served today, query parameters, status codes, whether it is authenticated.
- **DTO** — which fields are `Option[...]`, the real type of each field, the full enum values.
- **Errors** — which codes the route produces, and whether it reuses one code for several failures.

### The command → source map

`data/command-backend-source-map.csv`, one row per command:

| Column                                    | Holds                                                            |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `client name`                             | `cc-api`, `cc-api-bridge` or `redis-http`                        |
| `command class name`                      | The command class                                                |
| `command group` / `command version`       | Its `@group` / `@version`                                        |
| `repoUrl` / `source`                      | Repository, then repo-relative path and line of the route        |
| `dtoRepoUrl` / `dtoSource`                | Same for the response DTO                                        |

Paths are repo-relative: where a backend is cloned is per-machine. Resolve a row as
`<your backend checkouts dir>/<last segment of repoUrl>/<source>`. The convention is one directory
holding every checkout, each named after its repository (`~/dev/backend/ovd`, `~/dev/backend/cc-api`);
set `CC_BACKEND_REPOS_DIR` if yours live elsewhere. Clone with `glab repo clone <repoUrl>`.

Keep the map true, or it stops being read:

- New command → add its row.
- Backend moved → update `source` / `dtoSource`, including the line number you just looked at.
- Command deleted → delete its row.
- Nothing to point at → write the reason, `N/A (empty 200, no body)`; an empty cell reads as "not
  looked up yet".

Rows are grouped by client, then by command group. A `source` cell may chain hops
(`conf/routes:30 -> app/controllers/Application.scala:256`) and carry a parenthetical caveat. A
command hitting several routes points at the one that defines its output.

## File layout

A domain lives in `src/clients/{client}/commands/{domain}/`:

| File                                 | Holds                                                        |
| ------------------------------------ | ------------------------------------------------------------ |
| `{verb}-{resource}-command.ts`       | The command class, its error-code constants, its inner commands |
| `{verb}-{resource}-command.types.ts` | `XxxCommandInput` and `XxxCommandOutput`                     |
| `{domain}.types.ts`                  | Entity types shared by the domain                            |
| `{domain}-transform.ts`              | Payload → entity transforms                                  |
| `{domain}-utils.ts`                  | Helpers shared by several commands (polling waiters, …)      |

File names are kebab-case and match the class they export. Imports carry the `.js` extension; type
imports use `import type`. Nothing to register: the wildcard subpath export
`@clevercloud/client/cc-api-commands/{domain}/{file}.js` picks the files up.

## Naming the command

`{Verb}{Resource}Command`, resource **singular** even for listings —
`ListKubernetesClusterCommand`.

Verbs in use: `Get`, `List`, `Delete`, `Create`, `Update`, `Add`, `Check`, `Set`, `Stream`, `Remove`,
`Reboot`, `Rebuild`, `Resume`, `Reset`, `Request`, `Enable`, `Disable`, `Cancel`, `Upload`,
`Link`/`Unlink`. Prefer one of these over a synonym.

## Base class

| Base class              | Use when                                                    |
| ----------------------- | ----------------------------------------------------------- |
| `CcApiSimpleCommand`    | One HTTP request                                            |
| `CcApiCompositeCommand` | Several requests, a poll, a fallback, any orchestration     |
| `CcApiStreamCommand`    | A Server-Sent Events stream                                 |

A composite command's own requests are private inner commands in the same file, not exported, named
`XxxInnerCommand`, sent through the composer.

## Class JSDoc

```ts
/**
 * Lists the log drains of an application or an add-on, most recently updated first.
 *
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains
 * @group LogDrain
 * @version 4
 */
```

- `@endpoint [METHOD] /path` — one per endpoint reached, inner commands included, path parameters
  written `:XXX`, absolute URLs in full.
- `@group` — the domain, PascalCase.
- `@version` — `2` or `4`, omitted when the endpoint has none.
- `Common error codes: see {@link XXX_ERROR_CODES}` when the command has them.

Tags are parsed by `pnpm run endpoints-list` and `endpoints-analyze`.

**Prose stays succinct**: one sentence on what the command does, then only what a caller cannot
guess (a delete accepted before it completes, a fallback, a sort, a cache). Long explanations go in
a code comment, not in what shows up in the caller's editor.

## Inputs

```ts
/**
 * Identifies the application to retrieve. The owner is resolved automatically when omitted.
 */
export interface GetApplicationCommandInput extends ApplicationId {
  /** Whether to also fetch the branches of the deployment repository. Costs one extra request. */
  withBranches?: boolean;
}
```

- Extend the id types from `../../types/cc-api.types.js`: `ApplicationId`, `AddonId`,
  `AddonProviderId`, `OauthConsumerKey`, `ApplicationOrAddonId`. They make `ownerId` optional, which
  is what lets the client resolve it.
- Never `X | null`; use `?`.
- Dates take `Date | string | number`, durations take `number | string` (milliseconds or ISO 8601).
- Boolean prefixes: `should*` changes what the call does (`shouldWait`), `with*` asks for extra data
  (`withBranches`), `is*`/`has*`/`can*` writes a value onto the resource (`isFavourite`).
- Tag divergences from the wire: `@sentAs \`payloadKey\``, `@converted <what happens>`, `@default`.

## Outputs

`XxxCommandOutput`, usually an alias over an entity from `{domain}.types.ts`.

### `undefined` is the only way to say "absent"

Never publish `X | null`. Optional field + `?? undefined` in the transform:

```ts
httpUrl: payload.httpUrl ?? undefined,
```

The backends do send `null` on the wire, so **never forward a payload object whole** — build it
field by field, even when the shapes look identical.

A command with nothing to return is typed `undefined` and says so; delete commands discard the
response body even when the API sends one:

```ts
transformCommandOutput(): undefined {
  return undefined;
}
```

### Missing resources reject

No empty-response policy: a 404 rejects. When absence is a legitimate state for the caller, wrap the
send in `tolerateNotFound()` from `src/utils/error-utils.ts`.

### Dates

Every output date goes through `normalizeDate()` — the uniform ISO output is the normaliser's doing,
not the backend's. It returns `undefined` for a nullish input; assert with `!` only where the
backend always sends the field:

```ts
createdAt: normalizeDate(payload.creationDate)!,
paidAt: normalizeDate(payload.payDate),
```

### Durations

Outputs stay ISO 8601 strings; consumers read them with `parseDuration()`. Inputs go through
`normalizeDuration()`, which converts milliseconds and passes strings through untouched (endpoints do
not all read the same grammar — some accept the calendar period `P1M`).

### Ordering

A listing with a natural order is sorted by the command, documented in the class JSDoc and on the
field, using `sortBy()` from `src/lib/utils.js`:

```ts
sortBy(items.map(transformLogDrain), { key: 'updatedAt', order: 'desc' });
```

Sort on the field carrying the meaning, not one that correlates with it: price plans sort by
`maxQuantity` (`null` as infinity), not by `price`.

## Naming fields

Applies to every published interface, nested objects included. Renames never reach the wire — the
transform keeps the payload keys.

- **Booleans** prefixed `is` / `has` / `can` / `should` / `supports` / `was`. `was` is for the
  outcome of the call that just ran (`wasDeleted`), not a lasting state.
- **Dates** end in `At`: `createdAt`, `expiresAt`, `lastDeployedAt`.
- **Arrays are plural**, unless the collection is one cohesive thing (an app's `environment`).
- **`state`** is data or resource state; **`status`** is operational or lifecycle status.
- **Approved abbreviations**: `id`, `url`, `sso`, `api`, `ip`, `dns`, `http(s)`, `tcp`, `mfa`,
  `oauth`, `ssh`, `vat`, `cpu`, `ram`, `uuid`. Everything else spelled out (`shortDescription`,
  `networkGroup*`).
- **Acronyms**: lowercase when leading (`vat`, `oauthApp`), uppercase mid-name (`preferredMFA`,
  `outboundIPs`), spelled into a phrase where a verb belongs (`canPayWithSEPA`).
- **URLs end in `Url`**, never `Uri`.
- **Generic names** (`name`, `type`, `value`, `key`, `label`, `kind`) only on a primary entity, where
  the interface supplies the context; elsewhere `ssoUrl`, not `url`.
- **British spelling**: `organisation`, `favourite`, `behaviour`, `cancelled`.
- **Invert rather than keep a double negative**: `homogeneous` → `isZeroDowntimeDeploymentEnabled`,
  value negated.

## Documenting types

Every interface, field and exported alias carries a JSDoc comment — a name cannot say that `realId`
is the provider-side identifier, or that `createdAt` is an ISO string rather than the timestamp the
API sends.

**One sentence per field**, on a single `/** … */` line where it fits. A second sentence only for a
constraint the type does not carry (unit, bound, default, when the field is filled). Never paraphrase
the name (`/** The name. */`), describe the type, or explain the API. Interface comments: one or two
sentences on what the entity is.

```ts
/**
 * Domains the application answers on.
 * @renamedFrom `vhosts`
 * @converted each entry reduced to its `fqdn`
 * @converted sorted by domain
 */
domains: Array<Domain>;
```

- `@renamedFrom \`payloadKey\`` — output field named differently from the payload.
- `@sentAs \`payloadKey\`` — input field named differently from the payload.
- `@converted <what happens>` — one per conversion.

Inline object types are expanded over several lines so nested fields can carry their own comment.

## Transforms

```ts
export function transformApplication(payload: any): Application {
  return {
    id: payload.id,
    canShutdown: payload.deployment.shutdownable,
    createdAt: normalizeDate(payload.creationDate)!,
    isZeroDowntimeDeploymentEnabled: !payload.homogeneous,
    shouldForceHttps: payload.forceHttps === 'ENABLED',
    environment: sortBy(payload.env, 'name'),
    httpUrl: payload.httpUrl ?? undefined,
  };
}
```

The only place the wire format is allowed to exist: map every field explicitly, normalise dates,
convert sentinel strings, sort, map `null` to `undefined`. Model the payload honestly rather than
conveniently — the emailhooks API sends one `{type, target}` pair per notified entity, so the client
publishes one entry per entity instead of a comma-joined string.

A type handed straight from the payload with no transform **is** a description of the wire format;
check the backend before declaring it.

## Building the request

```ts
toRequestParams(params: ListLogDrainCommandInput) {
  return get(
    safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains`,
    new QueryParams().set('status', params.status).set('executionStatus', params.executionStatus),
  );
}
```

- `safeUrl` for every interpolated URL; it encodes the values.
- Builders from `src/lib/request/request-params-builder.js` (`get`, `post`, `postJson`, `put`,
  `putJson`, `patch`, `patchJson`, `head`, `delete_`) set `accept` and `content-type`. Drop to a
  literal `Partial<CcRequestParams>` plus `HeadersBuilder` only for an unusual accept or a raw body.
- `QueryParams.append()` drops nullish values, so optional filters need no guard; `set()` overwrites,
  `append()` accumulates.
- Normalise on the way out: `normalizeDate(params.since)`, `normalizeDuration(params.interval)`.

### Id resolution

```ts
getIdsToResolve(): IdResolve {
  return { ownerId: true, addonId: 'REAL_ADDON_ID' };
}
```

`addonId` takes `'ADDON_ID'` / `'REAL_ADDON_ID'`, or `{ property, type }` when the id sits under
another key. Resolution is skipped when the property is absent, so optional and union-typed ids are
safe to declare.

### Request config and auth

```ts
getRequestConfig(): CcRequestConfigPartial {
  return { isCorsEnabled: true, cache: { ttl: DEFAULT_CACHE_TTL } };
}

isAuthEnabled(): boolean {
  return false;
}
```

The config is applied over the client defaults, and what `send()` passes still wins. Opt out of auth
for public routes and presigned URLs carrying their own token. `toRequestParams()` may return an
absolute `http(s)://` URL, used as is; auth applies only under the client base URL, so credentials
never reach another origin.

## Idempotency

```ts
isIdempotent(): boolean {
  return true;
}
```

Last in the class body, beside `isAuthEnabled()`. It answers one question: **can this command be sent
twice without meaning it twice**. A caller whose connection died mid-flight cannot know whether the
server saw the request; this is what tells it whether asking again is safe. `CcNetworkError.isWorthRetrying()`
reads it, and a stream reconnects on it.

**The effect, not the answer.** What matters is what a second identical call *changes* on the server,
never what it *replies*. A `DELETE` replayed after it succeeded deleted nothing more, so it is
idempotent, and the 404 is the caller's to read — say so in the class JSDoc when a caller is likely
to meet it.

**Decide it from the backend source.** Open the route from the command's row in
`data/command-backend-source-map.csv` and ask what state a second identical call leaves behind.

| The handler                                        | Answer                             |
| -------------------------------------------------- | ---------------------------------- |
| Leaves the same state, whatever it replies         | `true`                             |
| Appends, counts, notifies, mails, bills, allocates | `false`                            |
| Cannot tell from the route                         | `false`, with a comment saying why |

Being wrong here means an action performed twice: a resource created twice, a mail sent twice, a
counter moved twice. So `false` is both the default and the honest answer for a route nobody has read.

**The method is not the criterion**, in either direction. `PUT /v2/self/emails/:XXX` mails a validation
link on every call, and every `redis-http` read is served over `POST` and changes nothing. Reads are
not exempt from the question: a `GET` is checked and declared like everything else. Never fill this in
across a batch of commands from the builder they call — that is the guess this method exists to replace.

**A composite answers for the whole command.** A caller can only replay the composite, so `true` means
"replaying all of it is safe": one that creates and then waits is `false` even though every step read
cleanly. Nothing changes in `compose()` — the client applies the composite's answer as a ceiling over
every request it sends. A composite that only reads (`GetPrimaryDomainCommand` over
`ListDomainCommand`) can declare `true`.

**Stream commands have nothing to declare** and do not have the method at all: a stream is a `GET`
subscribing to something already happening, so opening it again observes rather than acts. The client
marks every stream request replayable, which is what lets a dropped connection be reconnected.

## Errors

Endpoints answer with codes callers should not have to know (`6451` on v2, a generic `999` on some
v4 routes). Map them to named codes exported as a frozen constant:

```ts
/**
 * The error codes this command can produce, to compare against `error.code`.
 *
 * - `INVALID_FORMAT`: the given domain is not something the API can work with
 * - `ALREADY_USED`: the given domain is already attached to an application
 */
export const CREATE_DOMAIN_ERROR_CODES = {
  INVALID_FORMAT: 'clever.domain.invalid-format',
  ALREADY_USED: 'clever.domain.already-used',
} as const;

export type CreateDomainErrorCode = (typeof CREATE_DOMAIN_ERROR_CODES)[keyof typeof CREATE_DOMAIN_ERROR_CODES];

const API_ERROR_CODES: Record<string, CreateDomainErrorCode> = {
  '8302': CREATE_DOMAIN_ERROR_CODES.FORBIDDEN,
};

transformErrorCode({ code, message }: ApiErrorInfo) {
  return API_ERROR_CODES[code] ?? code;
}
```

- `<COMMAND_NAME>_ERROR_CODES` for the object, `<CommandName>ErrorCode` for the union, values dotted
  as `clever.<domain>.<failure>`.
- A lookup record, not an if-chain; unknown codes pass through unchanged.
- `ApiErrorInfo` carries `code`, `message` and `status`, so an endpoint reusing one code for several
  failures can still be told apart on the message. Matching an English message is a last resort:
  mark it `FIXME` with what would let it go, and keep it here rather than in every consumer.
- Rate limiting is normalised by the client (429 on v4, 403 with `id` 403 on v2 →
  `clever.core.too-many-requests`); commands do not handle it. Callers narrow with the predicates in
  `src/utils/error-utils.ts` instead of duck-typing `error.statusCode`.

## Composite commands

```ts
async compose(params: DeleteKubernetesClusterCommandInput, composer: CcApiComposer): Promise<undefined> {
  await composer.send(new DeleteKubernetesClusterCommandInner(params));
  if (params.shouldWait) {
    await waitForKubernetesClusterDeletion(composer, params.ownerId, params.clusterId);
  }
  return undefined;
}
```

- A slow operation returns as soon as it is accepted, and waits only behind a `shouldWait` flag.
- Waiting is a `Polling` from `src/utils/polling.js`, wrapped in a `waitForXxx()` helper in
  `{domain}-utils.ts`, with named timeout constants justified by a comment.
- Waiting for a resource to disappear treats the 404 as the awaited state.
- Reuse commands instead of duplicating them: `GetPrimaryDomainCommand` derives its result from
  `ListDomainCommand`.
- [Idempotency](#idempotency) is answered for the whole command, not per step: a caller can only replay
  the composite, and the client holds every request it sends to what it declared.

## Stream commands

Extend `CcApiStreamCommand` (or a domain base such as `AbstractLogsStreamCommand`), build the request
the same way, convert each event through a transform.

## Tests

E2E case per command in `test/e2e/clients/cc-api/commands/{domain}-commands.spec.ts`, on
`e2eSupport()` with `prepare()` / `cleanup()`. Specs run in Node and in a real browser; anything
environment-specific needs a `.node.spec.ts` / `.browser.spec.ts` suffix. Transforms carrying real
logic get a unit spec next to the source.

Assert the contract, not the fixture: void output is `undefined`, an absent optional field is
`undefined`, a date equals `new Date(value).toISOString()`, a sorted listing comes back sorted.

## Before the PR

`pnpm run lint`, `pnpm run format:check`, `pnpm run typecheck` and `pnpm run test` pass, the map row
is accurate, `isIdempotent()` was answered against the route rather than assumed, and the changelog
entry describes the change for consumers, breaking changes spelled out.
