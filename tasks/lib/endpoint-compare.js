import safeStringify from 'safe-stringify';
import { isIgnored } from './endpoint-ignore.js';

/**
 * @typedef {import('./endpoint.types.js').EndpointsSource} EndpointsSource
 * @typedef {import('./endpoint.types.js').AnalyzedOpenapi} AnalyzedOpenapi
 * @typedef {import('./endpoint.types.js').Endpoint} Endpoint
 * @typedef {import('./endpoint.types.js').OpenapiDiff} OpenapiDiff
 */

/**
 * @param {EndpointsSource} source
 * @param {Record<string, Endpoint>} before
 * @param {Record<string, Endpoint>} after
 * @return {OpenapiDiff}
 */
export function compareEndpoints(source, before, after) {
  const endpointsBefore = Object.values(before).filter((endpoint) => !isIgnored(source, endpoint));
  const endpointsAfter = Object.values(after).filter((endpoint) => !isIgnored(source, endpoint));

  // new paths
  const addedEndpoints = endpointsAfter.filter(({ id }) => before[id] == null);

  // deleted paths
  const deletedEndpoints = endpointsBefore.filter(({ id }) => after[id] == null);

  // paths diff
  const modifiedEndpoints = endpointsBefore
    .filter(({ id }) => after[id] != null)
    .filter((path) => safeStringify(path) !== safeStringify(after[path.id]));

  return {
    hasDiff: addedEndpoints.length > 0 || deletedEndpoints.length > 0 || modifiedEndpoints.length > 0,
    addedEndpoints: addedEndpoints,
    deletedEndpoints: deletedEndpoints,
    modifiedEndpoints: modifiedEndpoints,
  };
}

/**
 * @param {string} now
 * @param {Array<AnalyzedOpenapi>} analyzed
 * @returns {string}
 */
export function generateMarkdownReport(now, analyzed) {
  const withDiffs = analyzed.filter((c) => c.diff.hasDiff);

  return `# Diff Report ${now}
${withDiffs
  .map(
    ({ versionedOpenapi, diff, previous }) => `
## ${versionedOpenapi.source.id}

${previous != null ? `Diff since ${previous.versionedOpenapi.date}` : 'First time'}

### Added endpoints
${endpointsMarkdownChapter(diff.addedEndpoints)}

### Removed endpoints
${endpointsMarkdownChapter(diff.deletedEndpoints)}

### Modified endpoints
${endpointsMarkdownChapter(diff.modifiedEndpoints)}
`,
  )
  .join('')}
`;
}

/**
 * @param {Array<Endpoint>} endpoints
 */
function endpointsMarkdownChapter(endpoints) {
  if (endpoints == null || endpoints.length === 0) {
    return '\nNone';
  }

  return `
~${endpoints.length}

${endpoints
  .map(
    (endpoint) => `

#### ${endpoint.id}

\`\`\`json
${safeStringify(endpoint, { indentation: 2 })}
\`\`\`
`,
  )
  .join('')}
`;
}

/**
 * @param {string} now
 * @param {Array<AnalyzedOpenapi>} analyzed
 * @returns {string}
 */
export function generateJsonReport(now, analyzed) {
  const jsonReport = Object.fromEntries(
    analyzed.map(({ versionedOpenapi, diff, previous }) => {
      return [
        versionedOpenapi.source.id,
        {
          source: versionedOpenapi.source,
          date: versionedOpenapi.date,
          previousDate: previous?.versionedOpenapi.date,
          diff,
        },
      ];
    }),
  );

  return safeStringify({ reportDate: now, ...jsonReport }, { indentation: 2 });
}
