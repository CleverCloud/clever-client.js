import fs from 'node:fs';
import type { CommandDetail, Endpoint, EndpointsSource } from './endpoint.types.ts';

const CSV_HEADER: Array<string> = [
  'Source id',
  'Endpoint id',
  'Used',
  'Namespace',
  'Target',
  'Action',
  'Command name (without Command suffix)',
  'Composite',
  'Auto owner',
  'Legacy',
  'Comment',
];

export function parseCommandsList(path: string): Map<string, CommandDetail> {
  const csv = fs.readFileSync(path).toString();

  const result: Map<string, CommandDetail> = new Map();
  csv
    .split('\n')
    .filter((_v, i) => i > 0)
    .filter((line) => line.trim().length > 0)
    .forEach((line) => {
      const [
        sourceId,
        endpointId,
        isUsed,
        namespace,
        target,
        action,
        commandClassName,
        composite,
        autoOwner,
        legacy,
        comment,
      ] = line.split(',');
      result.set(endpointId, {
        sourceId,
        endpointId,
        isUsed: isUsed === 'true',
        namespace,
        target,
        action,
        commandClassName,
        composite: composite === 'true',
        autoOwner: autoOwner === 'true',
        legacy: legacy === 'true',
        comment,
      });
    });

  return result;
}

export function storeCommandsList(path: string, commands: Map<string, CommandDetail>): void {
  // csv
  const csv = [CSV_HEADER.join(',')];
  commands.forEach((commandDetail) => {
    csv.push(
      [
        commandDetail.sourceId,
        commandDetail.endpointId,
        commandDetail.isUsed,
        commandDetail.namespace,
        commandDetail.target,
        commandDetail.action,
        commandDetail.commandClassName,
        commandDetail.composite,
        commandDetail.autoOwner,
        commandDetail.legacy,
        commandDetail.comment,
      ].join(','),
    );
  });

  // write file
  fs.writeFileSync(path, csv.join('\n'));
}

export function flattenEndpointsBySourceTarget(
  endpointsBySource: Map<EndpointsSource, Array<Endpoint>>,
): Map<string, Array<{ source: EndpointsSource; endpoint: Endpoint }>> {
  const result: Map<string, Array<{ source: EndpointsSource; endpoint: Endpoint }>> = new Map();
  endpointsBySource.forEach((endpoints, source) => {
    const toAdd = endpoints.map((endpoint) => ({ source, endpoint }));
    result.set(source.target, [...(result.get(source.target) ?? []), ...toAdd]);
  });

  return result;
}
