#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Naming conventions based on user preferences
const APPROVED_ABBREVIATIONS = ['id', 'url', 'sso', 'api', 'ip', 'dns', 'http', 'tcp', 'mfa'];
const REJECT_ABBREVIATIONS = ['hv', 'ng', 'tva', 'apm', 'kpi'];

function analyzeFieldName(field, type, optional, comment, interfaceName) {
  const recommendations = [];
  const isBoolean = type === 'boolean';
  const isDate = type === 'string' && (field.toLowerCase().includes('date') || field.toLowerCase().includes('time') || field === 'timestamp');
  const isArray = type.startsWith('Array<');

  // Check for boolean prefix
  if (isBoolean) {
    const hasBooleanPrefix = /^(is|has|can|should|will|supports?)/.test(field);
    if (!hasBooleanPrefix) {
      const suggestion = suggestBooleanName(field);
      recommendations.push(`🔄 RENAME: ${suggestion} (boolean should have is/has/can prefix)`);
    } else {
      // Check for verb agreement
      if (field.startsWith('support') && !field.startsWith('supports')) {
        recommendations.push(`🔄 RENAME: ${field.replace('support', 'supports')} (verb agreement)`);
      } else {
        recommendations.push('✅ KEEP');
      }
    }
  }

  // Check for date/time naming
  else if (isDate || field.includes('Date') || field.includes('date') || field === 'timestamp' || field.includes('At')) {
    if (field === 'timestamp') {
      recommendations.push('🔄 RENAME: createdAt or updatedAt (generic timestamp needs context)');
    } else if (field === 'date') {
      recommendations.push('🔄 RENAME: [context]At (e.g., createdAt, issuedAt - too generic)');
    } else if (field.endsWith('Date')) {
      const withoutDate = field.slice(0, -4);
      const suggestion = convertToAtSuffix(withoutDate);
      recommendations.push(`🔄 RENAME: ${suggestion} (standardize to 'At' suffix)`);
    } else if (field.startsWith('last') && !field.endsWith('At') && !field.endsWith('Date')) {
      recommendations.push(`🔄 RENAME: ${field}At (standardize to 'At' suffix)`);
    } else if (field.endsWith('At')) {
      recommendations.push('✅ KEEP');
    } else {
      recommendations.push('📝 CLARIFY: check if date/time field, add At suffix if needed');
    }
  }

  // Check for state vs status
  else if (field === 'state' || field === 'status' || field.includes('State') || field.includes('Status')) {
    if (field === 'state') {
      recommendations.push('📝 REVIEW: use "state" for data/resource state, "status" for operational status');
    } else if (field === 'status') {
      recommendations.push('📝 REVIEW: use "status" for operational/lifecycle, "state" for data state');
    } else if (field.endsWith('State')) {
      // Fields like repoState, vatState are correct (data state)
      recommendations.push('✅ KEEP (data/resource state)');
    } else if (field.endsWith('Status')) {
      // Operational status
      recommendations.push('✅ KEEP (operational status)');
    } else if (field === 'includeState' || field === 'excludeState') {
      recommendations.push('✅ KEEP (parameter name)');
    }
  }

  // Check for rejected abbreviations
  else if (REJECT_ABBREVIATIONS.some(abbr => field.toLowerCase().includes(abbr))) {
    const found = REJECT_ABBREVIATIONS.find(abbr => field.toLowerCase().includes(abbr));
    if (found === 'hv') {
      recommendations.push('🔄 RENAME: spell out (hv is unclear - hypervisor?)');
    } else if (found === 'ng') {
      recommendations.push('🔄 RENAME: networkGroup* (ng is unclear)');
    } else if (found === 'tva') {
      recommendations.push('🔄 RENAME: vat* (use English term, not French TVA)');
    } else if (found === 'apm') {
      recommendations.push('📝 CLARIFY: spell out APM (Application Performance Monitoring?)');
    } else if (found === 'kpi') {
      recommendations.push('📝 CLARIFY: spell out KPI (Key Performance Indicator?)');
    }
  }

  // Check for generic names
  else if (['name', 'type', 'value', 'data', 'config', 'options', 'label', 'filter', 'scope', 'key'].includes(field)) {
    recommendations.push(`📝 CLARIFY: too generic, add context (e.g., ${interfaceName.toLowerCase()}Name, ${interfaceName.toLowerCase()}Type)`);
  }

  // Check for URL/URI consistency
  else if (field.endsWith('Uri')) {
    const withUrl = field.replace(/Uri$/, 'Url');
    recommendations.push(`🔄 RENAME: ${withUrl} (standardize to Url suffix)`);
  } else if (field === 'url' || field === 'urls') {
    recommendations.push('📝 CLARIFY: too generic, add context (e.g., apiUrl, webhookUrl)');
  } else if (field.endsWith('Url')) {
    recommendations.push('✅ KEEP');
  }

  // Check for ID consistency
  else if (field === 'id') {
    recommendations.push('✅ KEEP (primary identifier)');
  } else if (field.endsWith('Id')) {
    recommendations.push('✅ KEEP');
  } else if (field === 'realId') {
    recommendations.push('⚠️ DEPRECATED: unclear naming (what makes it "real"? use specific name or just id)');
  }

  // Check for pluralization
  else if (isArray) {
    const isPluralName = field.endsWith('s') || field.endsWith('List');
    if (!isPluralName && field !== 'environment') {
      recommendations.push(`🔄 RENAME: ${field}s (array should have plural name)`);
    } else if (field === 'environment') {
      recommendations.push('🔄 RENAME: environments (array should be plural)');
    } else {
      recommendations.push('✅ KEEP');
    }
  }

  // Check for description variations
  else if (field === 'shortDesc' || field === 'longDesc') {
    const newName = field.replace('Desc', 'Description');
    recommendations.push(`🔄 RENAME: ${newName} (avoid abbreviating description)`);
  } else if (field === 'description' || field === 'shortDescription' || field === 'longDescription') {
    recommendations.push('✅ KEEP');
  }

  // Check for email/address consistency
  else if (field === 'email' && type === 'string') {
    recommendations.push('🔄 RENAME: emailAddress (be explicit)');
  } else if (field.includes('email') || field.includes('Email')) {
    recommendations.push('✅ KEEP');
  }

  // Check for special cases noted in comments
  else if (comment && comment.includes('renamed from')) {
    recommendations.push('✅ KEEP (already renamed from API format)');
  }

  // Check for wannabe/unclear naming
  else if (field === 'wannabeInvoiceId') {
    recommendations.push('⚠️ DEPRECATED: unclear naming (use draftInvoiceId or pendingInvoiceId)');
  } else if (field === 'nice') {
    recommendations.push('🔄 RENAME: priority or niceLevel (nice is unclear)');
  } else if (field === 'job' && interfaceName.includes('Member')) {
    recommendations.push('🔄 RENAME: jobTitle or role (job is too generic)');
  } else if (field === 'classic' || field === 'unusable') {
    recommendations.push('📝 CLARIFY: unclear meaning, consider more descriptive name');
  }

  // Check for with/include prefixes
  else if (field.startsWith('with') || field.startsWith('include')) {
    if (type === 'boolean') {
      recommendations.push('✅ KEEP (boolean input parameter)');
    } else {
      recommendations.push('📝 REVIEW: typically used for boolean flags');
    }
  }

  // Check for snake_case remnants
  else if (field.includes('_')) {
    recommendations.push('🔄 RENAME: convert to camelCase');
  }

  // Default: looks good
  else if (recommendations.length === 0) {
    recommendations.push('✅ KEEP');
  }

  return recommendations.join('; ');
}

function suggestBooleanName(field) {
  // Smart suggestions for boolean fields
  const endings = {
    'archived': 'isArchived',
    'enabled': 'isEnabled',
    'available': 'isAvailable',
    'valid': 'isValid',
    'verified': 'isVerified',
    'dedicated': 'isDedicated',
    'homogeneous': 'isHomogeneous',
    'private': 'isPrivate',
    'admin': 'isAdmin',
    'favourite': 'isFavorite',
    'favorite': 'isFavorite',
    'primary': 'isPrimary',
    'trusted': 'isTrusted',
    'validated': 'isValidated',
    'active': 'isActive',
    'personal': 'isPersonal',
    'production': 'isProduction',
    'test': 'isTest'
  };

  if (endings[field]) {
    return endings[field];
  }

  // Check if it's a capability
  if (field.endsWith('able')) {
    return 'can' + field.charAt(0).toUpperCase() + field.slice(1, -4);
  }

  // Default to 'is' prefix
  return 'is' + field.charAt(0).toUpperCase() + field.slice(1);
}

function convertToAtSuffix(baseName) {
  const mapping = {
    'creation': 'createdAt',
    'deletion': 'deletedAt',
    'emission': 'emittedAt',
    'expiration': 'expiresAt',
    'start': 'startsAt',
    'end': 'endsAt',
    'request': 'requestedAt',
    'usage': 'usedAt',
    'consumption': 'consumedAt',
    'pay': 'paidAt',
    'update': 'updatedAt',
    'lastEdit': 'lastEditedAt',
    'lastDeploy': 'lastDeployedAt',
    'lastUtilisation': 'lastUsedAt'
  };

  return mapping[baseName] || baseName + 'At';
}

// Main processing
const inputPath = path.join(__dirname, '..', 'interfaces-analysis.csv');
const outputPath = path.join(__dirname, '..', 'interfaces-analysis-with-recommendations.csv');

console.log('Reading CSV file...');
const csvContent = fs.readFileSync(inputPath, 'utf-8');
const lines = csvContent.split('\n');

console.log(`Processing ${lines.length} lines...`);

const outputLines = [];
const stats = {
  keep: 0,
  rename: 0,
  clarify: 0,
  deprecated: 0,
  review: 0
};

// Add recommendation column to header
const header = lines[0];
outputLines.push(header + ',recommendation');

// Process each line
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Parse CSV line (simple parser, assumes no commas in values except in quoted strings)
  const parts = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];

  if (parts.length < 7) continue;

  const filepath = parts[0]?.replace(/"/g, '') || '';
  const interfaceName = parts[1]?.replace(/"/g, '') || '';
  const field = parts[2]?.replace(/"/g, '') || '';
  const type = parts[3]?.replace(/"/g, '') || '';
  const optional = parts[4]?.replace(/"/g, '') || '';
  const comment = parts[5]?.replace(/"/g, '') || '';
  const lineNumber = parts[6]?.replace(/"/g, '') || '';

  const recommendation = analyzeFieldName(field, type, optional === 'true', comment, interfaceName);

  // Update stats
  if (recommendation.includes('✅ KEEP')) stats.keep++;
  if (recommendation.includes('🔄 RENAME')) stats.rename++;
  if (recommendation.includes('📝 CLARIFY')) stats.clarify++;
  if (recommendation.includes('⚠️ DEPRECATED')) stats.deprecated++;
  if (recommendation.includes('📝 REVIEW')) stats.review++;

  // Escape recommendation for CSV
  const escapedRecommendation = recommendation.includes(',') ? `"${recommendation}"` : recommendation;

  outputLines.push(line + ',' + escapedRecommendation);
}

console.log('Writing output file...');
fs.writeFileSync(outputPath, outputLines.join('\n'));

console.log('\n=== ANALYSIS COMPLETE ===');
console.log(`Output written to: ${outputPath}`);
console.log(`\nStatistics:`);
console.log(`  ✅ Keep: ${stats.keep}`);
console.log(`  🔄 Rename: ${stats.rename}`);
console.log(`  📝 Clarify: ${stats.clarify}`);
console.log(`  ⚠️  Deprecated: ${stats.deprecated}`);
console.log(`  📝 Review: ${stats.review}`);
console.log(`\nTotal fields analyzed: ${lines.length - 1}`);
