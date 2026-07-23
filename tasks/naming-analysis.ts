import parser from '@babel/parser';
import type { Node, TSPropertySignature, TSType } from '@babel/types';
import fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';

/**
 * Interface naming-consistency analysis.
 *
 * Walks every `*.types.ts` file under `src/`, extracts each field of every
 * `interface` and object-shaped `type` alias (including nested object literals),
 * then applies the naming conventions agreed for the next major version:
 *
 *  - booleans use an `is` / `has` / `can` / `should` / `was` prefix (`was` for the outcome
 *    of the operation that just ran, e.g. `wasDeleted`)
 *  - date/time fields use the `At` suffix (`createdAt`, `expiresAt`, ...)
 *  - `state` (data state) vs `status` (operational lifecycle) are distinct
 *  - approved abbreviations only (`id`, `url`, `sso`, `api`, `vat`, ...),
 *    rejected ones spelled out (`hv`, `ng`, `tva`, ...)
 *  - a leading acronym is lowercased (`VAT` → `vat`); mid-name it stays
 *    uppercase (`preferredMFA`, `outboundIPs`)
 *  - generic names (`name`, `type`, `value`, ...) only on primary entities
 *  - arrays are plural, descriptions are not abbreviated, URLs end in `Url`
 *
 * Outputs `recommendations.csv`, `by-field.json` and `stats.json` to the output
 * directory (argv[2], default `./naming-analysis`) and prints a summary.
 *
 * Run: `node --experimental-strip-types tasks/naming-analysis.ts [outDir] [srcDir]`
 */

const OUT_DIR = path.resolve(process.argv[2] ?? './naming-analysis');
const SRC_DIR = path.resolve(process.argv[3] ?? './src');

type Category = 'KEEP' | 'RENAME' | 'CLARIFY' | 'REVIEW' | 'DEPRECATED';

interface FieldRow {
  file: string;
  interface: string;
  path: string;
  field: string;
  type: string;
  optional: boolean;
  nested: boolean;
  intentional: boolean;
  comment: string;
  line: number;
  category: Category;
  recommendation: string;
}

// ---------------------------------------------------------------------------
// Conventions
// ---------------------------------------------------------------------------

const REJECT_ABBR: Record<string, { category: Category; hint: string }> = {
  hv: { category: 'RENAME', hint: 'spell out (hypervisor?)' },
  ng: { category: 'RENAME', hint: 'networkGroup* (ng is unclear)' },
  tva: { category: 'RENAME', hint: 'vat* (use English, not French TVA)' },
  apm: { category: 'CLARIFY', hint: 'spell out APM' },
  kpi: { category: 'CLARIFY', hint: 'spell out KPI' },
};

const BOOLEAN_MAP: Record<string, string> = {
  archived: 'isArchived',
  enabled: 'isEnabled',
  available: 'isAvailable',
  valid: 'isValid',
  verified: 'isVerified',
  dedicated: 'isDedicated',
  homogeneous: 'isHomogeneous',
  private: 'isPrivate',
  public: 'isPublic',
  admin: 'isAdmin',
  favourite: 'isFavorite',
  favorite: 'isFavorite',
  primary: 'isPrimary',
  trusted: 'isTrusted',
  validated: 'isValidated',
  active: 'isActive',
  personal: 'isPersonal',
  production: 'isProduction',
  test: 'isTest',
  deleted: 'isDeleted',
  default: 'isDefault',
  required: 'isRequired',
  hidden: 'isHidden',
  visible: 'isVisible',
  cancelOnPush: 'cancelsOnPush',
  stickySessions: 'hasStickySessions',
  separateBuild: 'hasSeparateBuild',
  forceHttps: 'isForceHttps',
  emailValidated: 'isEmailValidated',
  preferred: 'isPreferred',
};

const DATE_BASE_MAP: Record<string, string> = {
  creation: 'createdAt',
  deletion: 'deletedAt',
  emission: 'emittedAt',
  expiration: 'expiresAt',
  start: 'startsAt',
  end: 'endsAt',
  request: 'requestedAt',
  usage: 'usedAt',
  consumption: 'consumedAt',
  pay: 'paidAt',
  update: 'updatedAt',
  lastEdit: 'lastEditedAt',
  lastDeploy: 'lastDeployedAt',
  lastUtilisation: 'lastUsedAt',
  birth: 'bornAt',
};

const GENERIC = new Set([
  'name',
  'type',
  'value',
  'data',
  'config',
  'options',
  'label',
  'filter',
  'scope',
  'key',
  'kind',
  'status',
  'state',
  'code',
  'content',
  'target',
]);

// Abbreviations to spell out (the wire payload/query key is kept in the transform layer).
const EXPAND_ABBR: Record<string, string> = {
  env: 'environment',
  envVar: 'environmentVariable',
  envVars: 'environmentVariables',
  defaultEnv: 'defaultEnvironment',
};

// Fields whose acronym also needs spelling out to read as a phrase, because the acronym
// alone is a noun where the name calls for a verb.
const ACRONYM_MAP: Record<string, string> = {
  canSEPA: 'canPayWithSEPA',
};

/**
 * Lowercases an acronym that leads the field name (`VAT` → `vat`), so it reads as the first
 * camelCase word. Returns `null` when there is nothing to lowercase — an acronym sitting
 * mid-name (`preferredMFA`, `outboundIPs`) keeps its uppercase.
 */
function lowerLeadingAcronym(field: string): string | null {
  const acronym = /^[A-Z]{2,}(?![a-z])/.exec(field)?.[0];
  return acronym == null ? null : acronym.toLowerCase() + field.slice(acronym.length);
}

function suggestBoolean(field: string): string {
  if (BOOLEAN_MAP[field] != null) {
    return BOOLEAN_MAP[field];
  }
  if (field.endsWith('able')) {
    return 'can' + field[0].toUpperCase() + field.slice(1, -4);
  }
  return 'is' + field[0].toUpperCase() + field.slice(1);
}

function convertDate(base: string): string {
  return DATE_BASE_MAP[base] ?? base + 'At';
}

// ---------------------------------------------------------------------------
// Heuristics — returns the recommendation for one field name / type.
// ---------------------------------------------------------------------------

function analyze(field: string, type: string, iface: string): { category: Category; recommendation: string } {
  const lower = field.toLowerCase();
  const isBoolean = type === 'boolean' || /^boolean\b/.test(type) || type === 'boolean | null';
  const isArray = type.startsWith('Array<') || type.endsWith('[]');
  const hasBoolPrefix = /^(is|has|can|should|will|are|was|does|supports?|allows?|uses?|needs?|includes?|with)/.test(
    field,
  );

  if (field.includes('_')) {
    return { category: 'RENAME', recommendation: 'convert to camelCase' };
  }

  // acronym casing
  if (ACRONYM_MAP[field] != null) {
    return { category: 'RENAME', recommendation: `${ACRONYM_MAP[field]} (the acronym alone does not read as a verb)` };
  }
  const loweredAcronym = lowerLeadingAcronym(field);
  if (loweredAcronym != null) {
    return { category: 'RENAME', recommendation: `${loweredAcronym} (lowercase a leading acronym)` };
  }

  // spelled-out abbreviations
  if (EXPAND_ABBR[field] != null) {
    return { category: 'RENAME', recommendation: `${EXPAND_ABBR[field]} (spell out abbreviation)` };
  }

  // Booleans
  if (isBoolean) {
    if (!hasBoolPrefix) {
      return {
        category: 'RENAME',
        recommendation: `${suggestBoolean(field)} (boolean needs is/has/can/should prefix)`,
      };
    }
    if (/^support[^s]/.test(field)) {
      return { category: 'RENAME', recommendation: `${field.replace(/^support/, 'supports')} (verb agreement)` };
    }
    return { category: 'KEEP', recommendation: 'boolean prefix ok' };
  }

  // Date/time — narrow, to avoid false hits (deploymentId, lifetime, updateType, ...)
  const idish = /(Id|Ids|Url|Urls|Name|Count|Number|Version|Type|State|Status|Flavor|Zone)$/.test(field);
  if (!idish) {
    if (field === 'timestamp') {
      return { category: 'CLARIFY', recommendation: 'createdAt/updatedAt (generic timestamp needs context)' };
    }
    if (field === 'date') {
      return { category: 'CLARIFY', recommendation: '[context]At (too generic)' };
    }
    if (field.endsWith('At')) {
      return { category: 'KEEP', recommendation: 'At suffix ok' };
    }
    if (field.endsWith('Date')) {
      return { category: 'RENAME', recommendation: `${convertDate(field.slice(0, -4))} (standardize to At suffix)` };
    }
    if (/^(lastDeploy|lastEdit|lastUtilisation)$/.test(field)) {
      return { category: 'RENAME', recommendation: `${convertDate(field)} (standardize to At suffix)` };
    }
    if (/^(expiration|emission|creation|deletion|consumptionStart|consumptionEnd|birth)/.test(field)) {
      return { category: 'REVIEW', recommendation: 'date field — standardize to At suffix if it carries a date' };
    }
  }

  // state vs status
  if (field === 'state') {
    return { category: 'REVIEW', recommendation: 'state = data/resource state, status = operational lifecycle' };
  }
  if (field === 'status') {
    return { category: 'REVIEW', recommendation: 'status = operational lifecycle, state = data state' };
  }
  if (field.endsWith('State')) {
    return { category: 'KEEP', recommendation: 'data/resource state' };
  }
  if (field.endsWith('Status')) {
    return { category: 'KEEP', recommendation: 'operational status' };
  }

  // rejected abbreviations
  for (const [abbr, { category, hint }] of Object.entries(REJECT_ABBR)) {
    if (new RegExp(`(^|[^a-z])${abbr}([^a-z]|$)`, 'i').test(field) || lower.startsWith(abbr)) {
      return { category, recommendation: hint };
    }
  }

  // URL / URI
  if (field.endsWith('Uri')) {
    return { category: 'RENAME', recommendation: `${field.replace(/Uri$/, 'Url')} (standardize to Url)` };
  }
  if (field === 'uri') {
    return { category: 'RENAME', recommendation: 'url + context' };
  }
  if (field === 'url' || field === 'urls') {
    return { category: 'CLARIFY', recommendation: 'too generic (apiUrl, webhookUrl, ...)' };
  }
  if (field.endsWith('Url') || field.endsWith('Urls')) {
    return { category: 'KEEP', recommendation: 'Url suffix ok' };
  }

  // ids
  if (field === 'realId') {
    return { category: 'DEPRECATED', recommendation: 'unclear ("real"?) — use a specific name or id' };
  }
  if (field === 'wannabeInvoiceId') {
    return { category: 'DEPRECATED', recommendation: 'draftInvoiceId / pendingInvoiceId' };
  }
  if (field === 'id' || field.endsWith('Id') || field.endsWith('Ids')) {
    return { category: 'KEEP', recommendation: 'id ok' };
  }

  // description abbreviations
  if (field === 'shortDesc' || field === 'longDesc') {
    return {
      category: 'RENAME',
      recommendation: `${field.replace(/Desc$/, 'Description')} (do not abbreviate description)`,
    };
  }
  if (field === 'desc') {
    return { category: 'RENAME', recommendation: 'description (do not abbreviate)' };
  }

  // email
  if (field === 'email') {
    return { category: 'RENAME', recommendation: 'emailAddress (be explicit)' };
  }

  // array pluralization
  if (isArray) {
    const plural = field.endsWith('s') || lower.endsWith('list');
    if (!plural) {
      return { category: 'RENAME', recommendation: `${field}s (array should be plural)` };
    }
    return { category: 'KEEP', recommendation: 'plural array ok' };
  }

  // misc known-bad
  if (field === 'nice') {
    return { category: 'RENAME', recommendation: 'priority / niceLevel' };
  }
  if (field === 'job' && /member/i.test(iface)) {
    return { category: 'RENAME', recommendation: 'jobTitle / role' };
  }
  if (field === 'classic' || field === 'unusable') {
    return { category: 'CLARIFY', recommendation: 'unclear meaning' };
  }

  // generic names — only acceptable on primary-entity interfaces
  if (GENERIC.has(field)) {
    return { category: 'CLARIFY', recommendation: 'too generic — add context (only OK on primary-entity interfaces)' };
  }

  return { category: 'KEEP', recommendation: '' };
}

// ---------------------------------------------------------------------------
// Extraction (Babel AST — matches tasks/lib/api-analyze.ts tooling)
// ---------------------------------------------------------------------------

function walk(dir: string, acc: Array<string> = []): Array<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else if (entry.isFile() && entry.name.endsWith('.types.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

function cleanComment(node: TSPropertySignature): string {
  const comments = node.leadingComments ?? [];
  return comments
    .map((c) =>
      c.value
        .replace(/^\*+/, '')
        .split('\n')
        .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
        .filter(Boolean)
        .join(' '),
    )
    .join(' ')
    .trim();
}

/** Returns the nested object type literal a property points to, if any. */
function nestedLiteral(typeNode: TSType | null | undefined): TSType | null {
  if (typeNode == null) {
    return null;
  }
  if (typeNode.type === 'TSTypeLiteral') {
    return typeNode;
  }
  if (typeNode.type === 'TSArrayType' && typeNode.elementType.type === 'TSTypeLiteral') {
    return typeNode.elementType;
  }
  if (
    typeNode.type === 'TSTypeReference' &&
    typeNode.typeName.type === 'Identifier' &&
    typeNode.typeName.name === 'Array' &&
    typeNode.typeParameters?.params.length === 1 &&
    typeNode.typeParameters.params[0].type === 'TSTypeLiteral'
  ) {
    return typeNode.typeParameters.params[0];
  }
  return null;
}

const rows: Array<FieldRow> = [];

function processMembers(
  members: Array<Node>,
  container: string,
  prefix: string,
  code: string,
  relPath: string,
  lines: Array<number>,
): void {
  for (const member of members) {
    if (member.type !== 'TSPropertySignature' || member.key == null) {
      continue;
    }
    const key = member.key;
    const field =
      key.type === 'Identifier'
        ? key.name
        : key.type === 'StringLiteral'
          ? key.value
          : code.slice(key.start!, key.end!);
    const typeNode = member.typeAnnotation?.typeAnnotation ?? null;
    const type = typeNode != null ? code.slice(typeNode.start!, typeNode.end!).replace(/\s+/g, ' ') : 'any';
    const optional = member.optional === true;
    const comment = cleanComment(member);
    const line = member.loc?.start.line ?? 0;
    const { category, recommendation } = analyze(field, type, container);

    rows.push({
      file: relPath,
      interface: container,
      path: prefix + field,
      field,
      type,
      optional,
      nested: prefix !== '',
      intentional: /renamed from|converted from|renamed|converted/i.test(comment),
      comment,
      line,
      category,
      recommendation,
    });

    const literal = nestedLiteral(typeNode);
    if (literal != null && literal.type === 'TSTypeLiteral') {
      processMembers(literal.members, container, `${prefix}${field}.`, code, relPath, lines);
    }
  }
}

function main(): void {
  const files = walk(SRC_DIR);

  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const ast = parser.parse(code, { sourceType: 'module', plugins: ['typescript'], attachComment: true });
    const relPath = path.relative(path.dirname(SRC_DIR), file);

    for (const stmt of ast.program.body) {
      const decl = stmt.type === 'ExportNamedDeclaration' && stmt.declaration != null ? stmt.declaration : stmt;
      if (decl.type === 'TSInterfaceDeclaration') {
        processMembers(decl.body.body, decl.id.name, '', code, relPath, []);
      } else if (decl.type === 'TSTypeAliasDeclaration' && decl.typeAnnotation.type === 'TSTypeLiteral') {
        processMembers(decl.typeAnnotation.members, decl.id.name, '', code, relPath, []);
      }
    }
  }

  writeOutputs(files.length);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function esc(value: unknown): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeOutputs(fileCount: number): void {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const HEAD: Array<keyof FieldRow> = [
    'file',
    'interface',
    'path',
    'field',
    'type',
    'optional',
    'nested',
    'intentional',
    'comment',
    'line',
    'category',
    'recommendation',
  ];
  const csv = [HEAD.join(',')].concat(rows.map((r) => HEAD.map((h) => esc(r[h])).join(','))).join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'recommendations.csv'), csv + '\n');

  const stats: Record<Category, number> = { KEEP: 0, RENAME: 0, CLARIFY: 0, REVIEW: 0, DEPRECATED: 0 };
  for (const r of rows) {
    stats[r.category]++;
  }

  const byField = new Map<
    string,
    { field: string; category: Category; recommendation: string; count: number; interfaces: Set<string> }
  >();
  for (const r of rows) {
    if (r.category === 'KEEP') {
      continue;
    }
    const k = `${r.field} ${r.category}`;
    let entry = byField.get(k);
    if (entry == null) {
      entry = {
        field: r.field,
        category: r.category,
        recommendation: r.recommendation,
        count: 0,
        interfaces: new Set(),
      };
      byField.set(k, entry);
    }
    entry.count++;
    entry.interfaces.add(r.interface);
  }
  const agg = [...byField.values()]
    .sort((a, b) => b.count - a.count)
    .map((e) => ({
      field: e.field,
      category: e.category,
      recommendation: e.recommendation,
      count: e.count,
      interfaces: [...e.interfaces],
    }));

  fs.writeFileSync(path.join(OUT_DIR, 'by-field.json'), JSON.stringify(agg, null, 2));
  fs.writeFileSync(
    path.join(OUT_DIR, 'stats.json'),
    JSON.stringify({ files: fileCount, fields: rows.length, stats }, null, 2),
  );

  const total = rows.length;
  const pct = (n: number): string => `${((n / total) * 100).toFixed(1)}%`;

  console.log(styleText('bold', '\nInterface naming analysis'));
  console.log(`  files scanned : ${fileCount}`);
  console.log(`  fields        : ${total} (nested: ${rows.filter((r) => r.nested).length})`);
  console.log(`  unique names  : ${new Set(rows.map((r) => r.field)).size}`);
  console.log('');
  for (const [category, count] of Object.entries(stats)) {
    console.log(`  ${category.padEnd(11)} ${String(count).padStart(5)}  ${pct(count)}`);
  }
  console.log(styleText('bold', '\nTop 25 flagged field names (by occurrences):'));
  for (const e of agg.slice(0, 25)) {
    console.log(
      `  ${String(e.count).padStart(3)}x  ${e.category.padEnd(11)} ${e.field.padEnd(24)} → ${e.recommendation}`,
    );
  }
  console.log(`\nWrote recommendations.csv, by-field.json, stats.json to ${path.relative(process.cwd(), OUT_DIR)}/`);
}

main();
