import fs from 'node:fs';

/**
 * @param {string} path
 * @return {Map<string, string>}
 */
export function parseCommandsList(path) {
  const csv = fs.readFileSync(path).toString();

  /** @type {Map<string, string>} */
  const result = new Map();
  csv
    .split('\n')
    .filter((_v, i) => i > 0)
    .filter((line) => line.trim().length > 0)
    .forEach((line) => {
      const [endpointId, commandClassName] = line.split(',');
      result.set(endpointId, commandClassName);
    });

  return result;
}
