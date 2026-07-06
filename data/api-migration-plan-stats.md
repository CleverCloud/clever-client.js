# API migration plan — statistics

Companion stats for `data/api-migration-plan.csv` / `data/api-migration-plan-notes.md`. All
figures derived directly from the CSV (648 rows).

## 1. Call sites to migrate, per project

Excludes the 88 rows already on the new client and the 4 intentionally-ignored/unused endpoints.

| Project | To migrate |
|---|---|
| console3 | 287 |
| clever-tools | 160 |
| clever-components | 109 |
| **Total** | **556** |

- Already using the new client (nothing to do): 88 (85 clever-components, 3 console3)
- Intentionally ignored/unused: 4 (2 console3, 2 clever-components)

| Project | File:line | Endpoint | Why ignored |
|---|---|---|---|
| clever-components | `cc-orga-member-list.smart.js:319` | `GET /v2/self/id` | Redundant with an existing full GET |
| clever-components | `cc-token-api-list.smart.js:207` | `POST /v2/password_forgotten` | Form POST (forgotten password) — has no place in an API client |
| console3 | `AddonMigrationSP.es6.js:66` | `GET /v2/products/addonproviders/:id/versions` | Duplicate of `GET /v4/addon-providers/:id`, with less info (no options) — migrate callers to that instead and drop this one |
| console3 | `UserSecuritySP.js:395` | `POST /v2/password_forgotten` | Same as above: form POST, shouldn't be in the client |

## 2. Call sites needing manual verification

**1**: `console3/src/models/business/proxys/summary.js:191` — dynamic dispatch
(`SummaryProxy.updateInOrganisation`) that resolves to either `GET /v2/organisations/:id/{part}`
or `GET /v2/self/{part}` depending on a runtime argument, with no callers found in console3
(looks unused).

Note: the 53 `UNKNOWN`/"no command implementation found" rows (see §3) are not counted here —
those are confidently-identified gaps, not ambiguous cases needing a judgment call.

## 3. Call sites with no existing command

**53 call sites**:

| Project | Call sites without a command |
|---|---|
| clever-tools | 31 |
| clever-components | 17 |
| console3 | 5 |
| **Total** | **53** |

Plus **16 call sites** that dispatch by provider (`no for known providers; yes for any other
provider` — 10 clever-tools, 6 clever-components): no command needs creating today, but one
would be needed if a provider outside the known list showed up.

## 4. Total commands to write

**39 distinct endpoints** (method + path) have no command at all — this is the number of new
commands to create (the 53 call sites above collapse onto these 39 endpoints, several call sites
sharing the same missing endpoint):

| Domain | Distinct endpoints |
|---|---|
| Kubernetes | 19 |
| Cellar | 13 |
| Drains v4 | 6 |
| `GET /v2/self/tokens/current` | 1 |
| **Total** | **39** |

The Kubernetes count here (19) is finer-grained than the "16" estimate in the notes file —
likely because the notes grouped variants such as `kubeconfig.yaml`/`kubeconfig/presigned-url`
or `version/check`/`version/update`.
