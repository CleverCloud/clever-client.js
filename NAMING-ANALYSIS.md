# Interface Naming Consistency Analysis

Refreshed against the current, fully-TypeScript codebase (branch `commands/add-missing-commands`).

This supersedes the earlier `the-renaming` exploration: that analysis ran against the
old `*.types.d.ts` declaration files, on a smaller command set, and its tooling flattened
away nested object types. The tooling has been rewritten to parse the current `*.types.ts`
sources with the repo's existing Babel toolchain, and now descends into nested object
literals as well.

## How to reproduce

```bash
node --experimental-strip-types tasks/naming-analysis.ts [outDir] [srcDir]
# outDir defaults to ./naming-analysis, srcDir to ./src
```

Outputs:
- `recommendations.csv` — one row per field (dotted `path` for nested fields), with the
  extracted type, leading comment, an `intentional` flag (set when the field carries a
  `renamed from` / `converted from` comment), and the suggested action.
- `by-field.json` — flagged field names aggregated by occurrence count.
- `stats.json` — totals.

No new dependency: the extractor uses `@babel/parser` (`typescript` plugin), the same
tooling already used by `tasks/lib/api-analyze.ts`.

## Overall statistics

Scanned **317 `*.types.ts` files**, **1 777 fields** (of which **135 nested**),
**612 unique property names**.

| Category | Count | % | Meaning |
|----------|------:|----:|---------|
| ✅ **KEEP** | 1 338 | 75.3% | Already follows conventions |
| 🔄 **RENAME** | 170 | 9.6% | Mechanical rename for consistency |
| 📝 **CLARIFY** | 235 | 13.2% | Too generic — needs context (case-by-case) |
| 📝 **REVIEW** | 31 | 1.7% | Needs a domain decision (`state` vs `status`, date-carrying fields) |
| ⚠️ **DEPRECATED** | 3 | 0.2% | Legacy naming to retire |

**≈ 439 fields (24.7%) would benefit from a rename or a clarification** — consistent with
the original finding (~22%) despite the larger surface, which confirms the conventions still
hold on the new commands.

By area (non-KEEP fields): `cc-api` 394 · `redis-http` 19 · `cc-api-bridge` 12 ·
`src/types` 8 · `src/utils` 4 · `src/lib` 2.

## Key finding: casing was normalized, semantics were not

**187 fields already carry a `renamed from` / `converted from` comment** from the earlier
snake_case → camelCase migration — but **49 of them still violate a naming convention**.
The migration normalized *casing* and *shape* (e.g. `config_vars` → `configVars`,
`vhosts` → `domains`, a number timestamp → an ISO string) without applying the *semantic*
conventions (boolean prefixes, `At` date suffix). Concrete examples in `Application`:

```ts
// converted from number to date iso string   → still not createdAt
creationDate: string;
// renamed from last_deploy                    → still not lastDeployedAt
lastDeploy: number;
// converted from ENABLED/DISABLED to boolean  → still not isForceHttps
forceHttps: boolean;
archived: boolean;         // → isArchived
stickySessions: boolean;   // → hasStickySessions
```

So this is a **second normalization pass**, orthogonal to the casing pass already done.

## Applied conventions (unchanged from the original analysis)

- **Booleans** carry an `is` / `has` / `can` / `should` / `supports` / `was` prefix. `was` is
  reserved for booleans that report the outcome of the operation that just ran rather than a
  lasting state of the resource — a delete endpoint answering "did this call remove the key?"
  returns `wasDeleted`, not `isDeleted`, which would read as "is the key currently deleted?".
- **Date/time** fields use the `At` suffix (`createdAt`, `expiresAt`, `lastDeployedAt`).
- **`state`** = data/resource state · **`status`** = operational/lifecycle status.
- **Approved abbreviations**: `id`, `url`, `sso`, `api`, `ip`, `dns`, `http(s)`, `tcp`,
  `mfa`, `oauth`, `ssh`, `vat`, `cpu`, `ram`, `uuid`.
- **Rejected abbreviations**: `hv` (spell out), `ng` → `networkGroup*`, `tva` → `vat`
  (English), `apm` / `kpi` (spell out or clarify).
- **Acronym casing**: an acronym that leads the field name is lowercased so it reads as the
  first camelCase word (`VAT` → `vat`); mid-name it keeps its uppercase (`preferredMFA`,
  `outboundIPs`). An acronym that stands where the name calls for a verb is spelled into a
  phrase (`canSEPA` → `canPayWithSEPA`).
- **Arrays** are plural · **descriptions** are not abbreviated (`shortDesc` →
  `shortDescription`) · **URLs** end in `Url` (not `Uri`).
- **Generic names** (`name`, `type`, `value`, `key`, `label`, `kind`, ...) are acceptable
  only on primary-entity interfaces where the interface name supplies the context.

## Actionable changes

### 1. Booleans without a prefix — 69 fields, 35 unique names (mechanical)

`archived` → `isArchived`, `favourite` → `isFavourite`, `homogeneous` → `isHomogeneous`,
`stickySessions` → `hasStickySessions`, `separateBuild` → `hasSeparateBuild`,
`forceHttps` → `isForceHttps`, `shutdownable` → `canShutdown`, `enabled` → `isEnabled`,
`emailValidated` → `isEmailValidated`, `verified` → `isVerified`, `admin` → `isAdmin`,
`private` → `isPrivate`, `autoscalingEnabled` → `isAutoscalingEnabled`,
`openInNewTab` → `opensInNewTab`, `dropTokens` / `revokeTokens` / `purgeObjects` (input
flags — likely `should…`), `deleted` → `wasDeleted`, `added` → `wasAdded` (operation
outcomes — see the `was` prefix above), `cors`, `debug`, `success`, `coldStorageLinked`, …

`favourite` keeps its UK spelling: the interface is consistently British
(`organisationId`, `OrganisationSummary`, `behaviour`, `cancelled`, …), so flipping this
single field to `isFavorite` would be the odd one out. Wire keys and URL paths
(`/v2/organisations/…/vhosts/favourite`) are unaffected either way.

### 2. Date/time → `At` suffix — 43 fields, 17 unique names (mechanical)

`creationDate` → `createdAt` (×11), `expirationDate` → `expiresAt` (×5),
`deletionDate` → `deletedAt`, `emissionDate` → `emittedAt`, `payDate` → `paidAt`,
`usageDate` → `usedAt`, `requestDate` → `requestedAt`, `startDate` → `startsAt`,
`endDate` → `endsAt`, `consumptionStartDate` → `consumptionStartedAt`,
`consumptionEndDate` → `consumptionEndedAt`, `lastDeploy` → `lastDeployedAt`,
`lastUtilisationDate` → `lastUsedAt`, `freeCreditsStartDate` / `freeCreditsEndDate`, …

### 3. Array pluralization — 38 fields, 18 unique names

`environment` → `environments` (×12, `Array<EnvironmentVariable>`),
`available` → `availableVersions` (×8, in the various `Check*VersionCommandOutput`),
`scope` → `scopes`, plus assorted single-occurrence arrays.

### 4. Generic names needing context — 235 fields (case-by-case, needs domain input)

`name` (×87), `type` (×43), `url` (×26), `value` (×19), `key` (×11), `kind` (×9),
`label` (×8), `date` (×8). Most `name`/`type` on primary entities are fine to keep; the
ones to fix are those on command Inputs/Outputs and nested objects. `url` standalone should
become `ssoUrl` / `apiUrl` / `webhookUrl` / …; bare `date` should become `<context>At`.

### 5. `state` vs `status` — 31 fields (needs a domain decision)

22 `status` and 9 `state` occurrences to audit against the semantic rule above. The
`*State` / `*Status` suffixed fields (`repoState`, `deploymentStatus`, …) are already correct
and kept.

### 6. Deprecated / unclear — 3 fields

| Field | Interface | Suggested |
|-------|-----------|-----------|
| `realId` | `Addon`, `AddonSummary` | `id`, or a specific name — "real" is a leftover from an API-id migration |
| `wannabeInvoiceId` | `Invoice` | `draftInvoiceId` / `pendingInvoiceId` |

Also flagged for clarification: the `apm*` fields (Grafana), `kpiComputeMonths` — spell out
or document the abbreviation.

## Suggested phasing

The full list is a breaking change and belongs to a major version. Because every field is
re-shaped in a transform function (`*-transform.ts`) sitting between the API payload and the
public type, renames touch the type, its transform, and the specs — but **not** the API
contract, which limits the blast radius.

1. **Phase 1 — mechanical, high-confidence (booleans + dates + plurals):** ~150 fields, the
   `RENAME` set. Low ambiguity, scriptable, one domain at a time (each is a self-contained
   `*.types.ts` + `*-transform.ts` + `*.spec.ts` triple).
2. **Phase 2 — generic-name clarifications:** the `CLARIFY` set, reviewed per interface with
   domain input, starting with command Inputs/Outputs and nested objects.
3. **Phase 3 — `state`/`status` audit + deprecated-field removal:** the `REVIEW` /
   `DEPRECATED` set.

Filter `recommendations.csv` by the `category` column to drive each phase.
