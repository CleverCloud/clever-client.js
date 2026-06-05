import safeStringify from 'safe-stringify';
import { isIgnored } from './endpoint-ignore.ts';
import type { AnalyzedOpenapi, Endpoint, EndpointsSource, OpenapiDiff } from './endpoint.types.ts';

export function compareEndpoints(
  source: EndpointsSource,
  before: Record<string, Endpoint>,
  after: Record<string, Endpoint>,
): OpenapiDiff {
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

export function generateMarkdownReport(now: string, analyzed: Array<AnalyzedOpenapi>): string {
  const withDiffs = analyzed.filter((c) => c.diff.hasDiff);

  return `# Diff Report ${now}
${withDiffs
  .map(
    ({ versionedOpenapi, diff, previous }) => `
## ${versionedOpenapi.source.id}

${previous != null ? `Diff since ${previous.versionedOpenapi.date}` : 'First time'}

### Added endpoints
${endpointsMarkdownChapter(diff.addedEndpoints ?? [])}

### Removed endpoints
${endpointsMarkdownChapter(diff.deletedEndpoints ?? [])}

### Modified endpoints
${endpointsMarkdownChapter(diff.modifiedEndpoints ?? [])}
`,
  )
  .join('')}
`;
}

function endpointsMarkdownChapter(endpoints: Array<Endpoint>): string {
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

export function generateJsonReport(now: string, analyzed: Array<AnalyzedOpenapi>): string {
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
