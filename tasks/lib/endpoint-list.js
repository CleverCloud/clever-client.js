import fs from 'node:fs';

/**
 * @typedef {import('./endpoint.types.js').CommandDetail} CommandDetail
 */

/** @type {Array<string>} */
const CSV_HEADER = [
  'Source id',
  'Endpoint id',
  'Used',
  'Namespace',
  'Target',
  'Action',
  'Command name (without Command suffix)',
  'Comment',
];

/**
 * @param {string} path
 * @return {Map<string, CommandDetail>}
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
      const [sourceId, endpointId, isUsed, namespace, target, action, commandClassName, comment] = line.split(',');
      result.set(endpointId, {
        sourceId,
        endpointId,
        isUsed: isUsed === 'true',
        namespace,
        target,
        action,
        commandClassName,
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
        commandDetail.comment,
      ].join(','),
    );
  });

  // write file
  fs.writeFileSync(path, csv.join('\n'));
}
