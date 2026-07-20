# Interface Naming Consistency Analysis - Summary Report

## Executive Summary

Analyzed **1,213 interface fields** across **405 unique property names** in the clever-client.js library.

### Overall Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| ✅ **Keep** - Already follows conventions | 767 | 63.2% |
| 🔄 **Rename** - Needs renaming for consistency | 138 | 11.4% |
| 📝 **Clarify** - Too generic, needs context | 130 | 10.7% |
| 📝 **Review** - Needs domain expert decision | 18 | 1.5% |
| ⚠️ **Deprecated** - Technical debt to remove | 0 | 0% |

**Key Finding:** While 63% of fields already follow good conventions, there are **268 fields (22%)** that would benefit from renaming or clarification for improved developer experience.

---

## Applied Naming Conventions

Based on your preferences for this major version update:

### ✅ Approved Abbreviations
- `id` - identifier (universal standard)
- `url` - Uniform Resource Locator
- `sso` - Single Sign-On
- `api` - Application Programming Interface
- `ip` - IP address (added as common standard)
- `dns`, `http`, `tcp`, `mfa` - Common technical terms

### ❌ Rejected Abbreviations
- `hv` → spell out (hypervisor?)
- `ng` → use `networkGroup*`
- `tva` → use `vat` (English instead of French)
- `apm`, `kpi` → spell out or clarify

### 📅 Date/Time Convention
**Standardize to `At` suffix** for all date/time fields:
- `creationDate` → `createdAt`
- `deletionDate` → `deletedAt`
- `expirationDate` → `expiresAt`
- `timestamp` → `createdAt` or `updatedAt` (add context)

### 🔘 Boolean Convention
**Always use prefix:** `is`, `has`, `can`, `should`, `supports`
- `archived` → `isArchived`
- `enabled` → `isEnabled`
- `favourite` → `isFavorite`
- `shutdownable` → `canShutdown`

### 🔄 State vs Status
**Semantic distinction:**
- **`state`** = data/resource state (e.g., `repoState`, `vatState`)
- **`status`** = operational/lifecycle status (e.g., `deploymentStatus`, `addonStatus`)

---

## Top 20 Most Critical Changes

### 1. Boolean Fields Without Prefixes (High Impact)

| Current Name | Recommended | Interface | Impact |
|--------------|-------------|-----------|--------|
| `archived` | `isArchived` | Application, CreateApplicationCommandInput | High - affects app state |
| `favourite` | `isFavorite` | Application, CreateApplicationCommandInput | High - user preference |
| `homogeneous` | `isHomogeneous` | Application | Medium - deployment config |
| `stickySessions` | `hasStickySessions` | Application | High - session management |
| `separateBuild` | `hasSeparateBuild` | Application | Medium - build config |
| `forceHttps` | `isForceHttps` | Application | High - security setting |
| `shutdownable` | `canShutdown` | CreateApplicationCommandInput | Medium - capability flag |
| `openInNewTab` | `opensInNewTab` | AddonProvider | Low - UI behavior |
| `useCache` | `shouldUseCache` | DeployApplicationCommandInput | Medium - build behavior |
| `emailValidated` | `isEmailValidated` | User | High - authentication |
| `verified` | `isVerified` | PaymentMethod | High - payment security |
| `valid` | `isValid` | Coupon | Medium - coupon state |
| `admin` | `isAdmin` | Member | High - permission level |
| `private` | `isPrivate` | SSH Key | Medium - visibility |

**Rationale:** Boolean fields without clear prefixes reduce code readability. Developers should immediately know a field is boolean from its name.

---

### 2. Date/Time Standardization (High Impact)

| Current Name | Recommended | Occurrences | Example Interface |
|--------------|-------------|-------------|-------------------|
| `creationDate` | `createdAt` | ~15 | Addon, Application, Instance, Backup |
| `deletionDate` | `deletedAt` | ~5 | Instance |
| `expirationDate` | `expiresAt` | ~3 | Backup |
| `emissionDate` | `emittedAt` | ~3 | Invoice |
| `payDate` | `paidAt` | ~2 | Invoice |
| `consumptionStartDate` | `consumptionStartedAt` | ~2 | Invoice |
| `consumptionEndDate` | `consumptionEndedAt` | ~2 | Invoice |
| `usageDate` | `usedAt` | ~2 | CouponUsage |
| `startDate` | `startsAt` | ~3 | Deployment, Credits |
| `endDate` | `endsAt` | ~3 | Credits |
| `lastDeploy` | `lastDeployedAt` | ~2 | Application |
| `timestamp` | `createdAt`/`updatedAt` | ~3 | Various (needs context) |

**Rationale:** Modern API convention uses `*At` suffix. More concise and aligns with common ORMs (Prisma, TypeORM, etc.). Tense consistency improves predictability.

---

### 3. Generic Names Lacking Context (Medium Impact)

| Current Name | Issue | Recommended Approach | Occurrences |
|--------------|-------|---------------------|-------------|
| `name` | Too generic in many contexts | Context-specific: `addonName`, `userName`, `planName` | ~50 |
| `type` | Unclear what is being typed | `resourceType`, `eventType`, `featureType` | ~15 |
| `value` | Ambiguous data meaning | `numericValue`, `stringValue`, `settingValue` | ~10 |
| `url` | URL to what? | `ssoUrl`, `apiUrl`, `webhookUrl`, `downloadUrl` | ~5 |
| `data` | Too vague | `configData`, `responseData`, `metaData` | ~8 |
| `options` | What kind of options? | `deployOptions`, `createOptions`, `addonOptions` | ~5 |
| `config` | Config for what? | `addonConfig`, `buildConfig`, `networkConfig` | ~4 |
| `label` | Label for what? | Depends on context - often can be `displayName` | ~3 |

**Example Impact:**
```typescript
// Before (unclear)
interface Addon {
  name: string;      // Name of what? The addon itself? The provider?
  type: string;      // What type? Addon type? Provider type?
  url: string;       // URL to where? SSO? Dashboard? Docs?
}

// After (clear)
interface Addon {
  addonName: string;     // Clear: it's the addon's name
  addonType: string;     // Clear: the type of addon
  dashboardUrl: string;  // Clear: URL to the dashboard
}
```

**Recommendation:** Most `name` fields in entity interfaces (Addon, Application, etc.) should remain as `name` since the interface name provides context. However, in nested objects or command inputs, be more explicit.

---

### 4. Email Field Inconsistency

| Current Name | Recommended | Interface | Reason |
|--------------|-------------|-----------|--------|
| `email` | `emailAddress` | GetAddonSsoCommandOutput, User, etc. | Be explicit - it's an address, not just "email" |

**Current Pattern:**
- `email` - 8 occurrences
- `emailAddress` - 12 occurrences
- `emailAddresses` - 3 occurrences
- `billingEmailAddress` - 2 occurrences

**Recommendation:** Standardize to `emailAddress` for consistency.

---

### 5. Unclear/Legacy Fields (Medium Priority)

| Current Name | Recommended | Interface | Reason |
|--------------|-------------|-----------|--------|
| `realId` | `id` or remove | Addon, Application | What makes it "real"? Likely legacy from API migration |
| `wannabeInvoiceId` | `draftInvoiceId` or `pendingInvoiceId` | Invoice | Unprofessional naming |
| `nice` | `priority` or `niceLevel` | ? | Unix `nice` value - unclear to many devs |
| `job` | `jobTitle` or `role` | Member | Too generic |
| `classic` | Clarify meaning | InvoiceClassic | What is "classic"? |
| `unusable` | `isUnusable` or better term | InvoiceUnusable | Missing boolean prefix |

---

### 6. Pluralization Issues

| Current Name | Recommended | Type | Reason |
|--------------|-------------|------|--------|
| `environment` | `environments` | `Array<EnvironmentVariable>` | Array should be plural |
| `linkedApplicationsEnvironment` | `linkedApplicationsEnvironments` | Array | Inconsistent pluralization |
| `linkedAddonsEnvironment` | `linkedAddonsEnvironments` | Array | Inconsistent pluralization |

---

### 7. URL/URI Inconsistency

| Pattern | Count | Recommendation |
|---------|-------|----------------|
| `*Url` suffix | ~15 | ✅ Keep - this is the standard |
| `url` (lowercase) | 2 | 🔄 Rename to context-specific `*Url` |
| `*Uri` suffix | 1 (`redirectUri`) | 🔄 Rename to `redirectUrl` for consistency |

---

### 8. Description Field Variations

| Current Name | Recommended | Occurrences |
|--------------|-------------|-------------|
| `shortDesc` | `shortDescription` | ~10 |
| `longDesc` | `longDescription` | ~10 |

**Rationale:** Don't abbreviate common words like "description". Consistency aids autocomplete.

---

## Category Breakdown

### Boolean Fields (30 fields need renaming)

**Pattern:** Missing `is`, `has`, `can`, `should` prefixes

**Examples:**
- Application: `archived`, `stickySessions`, `homogeneous`, `favourite`, `separateBuild`, `forceHttps`
- Member: `admin`
- User: `emailValidated`
- PaymentMethod: `verified`
- Various: `enabled`, `available`, `active`, `primary`, `dedicated`

**Impact:** High - affects code readability and boolean logic clarity

---

### Date/Time Fields (35+ fields need renaming)

**Pattern:** Inconsistent use of `Date` suffix vs `At` suffix vs no suffix

**Common patterns to fix:**
- `*Date` → `*At` (creationDate → createdAt)
- `last*` → `last*At` (lastDeploy → lastDeployedAt)
- `timestamp` → `*At` with context (createdAt, updatedAt)

**Impact:** High - affects consistency across the entire API surface

---

### Generic Names (50+ occurrences)

**Most common generic names:**
- `name` - appears in 50+ interfaces (needs case-by-case review)
- `type` - appears in 15+ places
- `value` - appears in 10+ places
- `url` - standalone, needs context
- `data`, `config`, `options`, `key`, `label`, `filter`, `scope`

**Impact:** Medium - reduces code clarity but doesn't break functionality

---

### State vs Status (18 fields need review)

**Current usage:**
- `state` fields: repoState, vatState, includeState, excludeState (mostly correct)
- `status` fields: status (generic usage)

**Recommendation:** Apply semantic distinction:
- Use `state` for data/resource states
- Use `status` for operational/lifecycle statuses

**Impact:** Low-Medium - clarifies intent but requires domain knowledge

---

## Migration Guide Snippets

### For Boolean Field Renames

```typescript
// Before
interface Application {
  archived: boolean;
  favourite: boolean;
  forceHttps: boolean;
}

// After
interface Application {
  isArchived: boolean;
  isFavorite: boolean;  // Also fixes UK→US spelling
  isForceHttps: boolean;
}

// Migration code (if supporting both)
type ApplicationLegacy = Application & {
  /** @deprecated Use isArchived instead */
  archived?: boolean;
  /** @deprecated Use isFavorite instead */
  favourite?: boolean;
  /** @deprecated Use isForceHttps instead */
  forceHttps?: boolean;
};
```

### For Date Field Renames

```typescript
// Before
interface Addon {
  creationDate: string;  // ISO 8601 string
}

// After
interface Addon {
  createdAt: string;  // ISO 8601 string
}

// Mapper helper for migration
function mapLegacyAddon(legacy: LegacyAddon): Addon {
  return {
    ...legacy,
    createdAt: legacy.creationDate,
  };
}
```

### For Generic Name Clarifications

```typescript
// Before
interface GetAddonSsoCommandOutput {
  url: string;      // What URL?
  name: string;     // Whose name?
  timestamp: number; // Timestamp of what?
}

// After
interface GetAddonSsoCommandOutput {
  ssoUrl: string;         // Clear: SSO login URL
  userName: string;       // Clear: user's name for SSO
  generatedAt: number;    // Clear: when token was generated
}
```

---

## Implementation Priority

### Phase 1: High Impact, Low Risk (Weeks 1-2)
1. ✅ Boolean prefix additions (30 fields)
   - Clear improvement, low complexity
   - Affects: Application, Member, User, etc.

2. ✅ Date/time standardization to `*At` (35 fields)
   - Consistent with modern conventions
   - Affects: All entity interfaces

### Phase 2: Medium Impact, Medium Risk (Weeks 3-4)
3. 📝 Generic name clarifications (case-by-case review)
   - Requires domain expertise for context
   - Focus on most ambiguous first: `url`, `timestamp`, `type`, `value`

4. 🔄 Email standardization to `emailAddress` (8 fields)
   - Simple rename, widespread impact

### Phase 3: Low Impact, Cleanup (Weeks 5-6)
5. 🔄 Description abbreviation expansion (`shortDesc` → `shortDescription`)
   - Low risk, improves consistency

6. 🔄 URL/URI standardization (`*Uri` → `*Url`)
   - Only 1 field (`redirectUri`)

7. ⚠️ Legacy field removal/clarification
   - `realId`, `wannabeInvoiceId`, `nice`, etc.
   - Requires understanding of why these exist

---

## Files Generated

1. **`interfaces-analysis-with-recommendations.csv`**
   - Original CSV with new `recommendation` column
   - Contains all 1,213 field analyses
   - Can be filtered/sorted for specific recommendations

2. **`NAMING-ANALYSIS-SUMMARY.md`** (this file)
   - Executive summary
   - Top changes
   - Migration guidance

3. **`scripts/analyze-naming.cjs`**
   - Reusable analysis script
   - Can be re-run as codebase evolves

---

## Next Steps

### Recommended Actions:

1. **Review High-Priority Changes**
   - Boolean prefixes (30 fields)
   - Date/time standardization (35 fields)
   - Get team approval for these systematic changes

2. **Case-by-Case Review for Generic Names**
   - Schedule review session with domain experts
   - Focus on most-used interfaces first (Addon, Application, User)
   - Create mapping of which "name" and "type" fields need context

3. **Create Deprecation Plan**
   - For major version: direct breaking changes OK
   - Consider providing temporary type aliases for common fields
   - Document migration in CHANGELOG and migration guide

4. **Automate Where Possible**
   - Write codemod scripts for systematic renames
   - Use TypeScript's refactoring tools
   - Update tests alongside interface changes

5. **Update Documentation**
   - Create naming conventions guide for future development
   - Document the approved abbreviations
   - Provide examples of good vs bad naming

---

## Naming Conventions Guide (For Future Development)

### ✅ DO

- **Use `is/has/can/should/supports` prefixes for booleans**
  ```typescript
  isActive: boolean
  hasPermission: boolean
  canDelete: boolean
  shouldRetry: boolean
  supportsBackup: boolean
  ```

- **Use `*At` suffix for date/time fields**
  ```typescript
  createdAt: string
  updatedAt: string
  expiresAt: string
  lastDeployedAt: string
  ```

- **Use approved abbreviations consistently**
  ```typescript
  id: string        // ✅ Universal standard
  url: string       // ✅ Widely known
  ssoUrl: string    // ✅ SSO is acceptable
  apiKey: string    // ✅ API is acceptable
  ```

- **Add context to generic names**
  ```typescript
  // In nested objects or commands
  addonName: string
  resourceType: string
  settingValue: string
  ```

- **Use semantic distinction for state vs status**
  ```typescript
  repoState: 'clean' | 'dirty'        // Data state
  deploymentStatus: 'pending' | 'running' | 'complete'  // Operational status
  ```

### ❌ DON'T

- **Don't use booleans without prefixes**
  ```typescript
  archived: boolean    // ❌ Bad
  isArchived: boolean  // ✅ Good
  ```

- **Don't mix date/time naming conventions**
  ```typescript
  creationDate: string  // ❌ Inconsistent
  createdAt: string     // ✅ Standard
  ```

- **Don't use unclear abbreviations**
  ```typescript
  hv: string   // ❌ What is hv?
  hypervisorId: string  // ✅ Clear

  ng: string   // ❌ What is ng?
  networkGroupId: string  // ✅ Clear
  ```

- **Don't use language-specific terms**
  ```typescript
  tva: number  // ❌ French for VAT
  vat: number  // ✅ English term
  ```

- **Don't leave generic names without context**
  ```typescript
  name: string  // ❌ Only OK in primary entity interfaces
  url: string   // ❌ URL to what?
  type: string  // ❌ Type of what?
  ```

---

## Conclusion

The analysis reveals a codebase in transition from snake_case API responses to camelCase JavaScript conventions. While significant progress has been made (63% of fields follow good conventions), there's opportunity to improve consistency in:

1. **Boolean naming** (11% of fields)
2. **Date/time conventions** (3% of fields)
3. **Generic name clarity** (11% of fields)

With systematic renaming in a major version release, the library can achieve excellent naming consistency, improving developer experience and reducing cognitive load for new users.

**Total fields requiring attention: 268 (22% of all fields)**
**Estimated effort: 2-3 weeks** for systematic renames + testing + documentation

---

*Analysis completed: 2025-11-18*
*Tool: Node.js CSV analyzer*
*Naming conventions based on: Modern JavaScript/TypeScript standards, REST API best practices, and team preferences*
