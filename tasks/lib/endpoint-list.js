/**
 * @import {CommandDetail, EndpointsSource, Endpoint} from './endpoint.types.js'
 */
import fs from 'node:fs';

/** @type {Array<string>} */
const CSV_HEADER = [
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

/**
 * @param {string} path
 * @returns {Map<string, CommandDetail>}
 */
export function parseCommandsList(path) {
  const csv = fs.readFileSync(path).toString();

  /** @type {Map<string, CommandDetail>} */
  const result = new Map();
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

/**
 * @param {string} path
 * @param {Map<string, CommandDetail>} commands
 */
export function storeCommandsList(path, commands) {
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

/**
 * @param {Map<EndpointsSource, Array<Endpoint>>} endpointsBySource
 * @returns {Map<string, Array<{source: EndpointsSource, endpoint: Endpoint}>>}
 */
export function flattenEndpointsBySourceTarget(endpointsBySource) {
  /** @type {Map<string, Array<{source: EndpointsSource, endpoint: Endpoint}>>} */
  const result = new Map();
  endpointsBySource.forEach((endpoints, source) => {
    const toAdd = endpoints.map((endpoint) => ({ source, endpoint }));
    result.set(source.target, [...(result.get(source.target) ?? []), ...toAdd]);
  });

  return result;
}
