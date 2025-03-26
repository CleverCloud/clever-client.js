import fs from 'fs-extra';
import path from 'node:path';
import { WORKING_DIR } from './config.js';


/**
 * @typedef {import('./endpoint.types.js').EndpointsSource} EndpointsSource
 * @typedef {import('./endpoint.types.js').Endpoint} Endpoint
 */


/** @type {Set<string>} */
let ignoredEndpoints

/**
 * @param {EndpointsSource} source
 * @param {Endpoint} endpoint
 */
export function isIgnored(source, endpoint) {
  if (ignoredEndpoints == null) {
    readIgnoredEndpoints();
  }

  return ignoredEndpoints.has(`${source.target} ${endpoint.id}`);
}


function readIgnoredEndpoints() {
  const ignoredFilePath = path.join(WORKING_DIR, '.ignore');
  const ignored = fs.readFileSync(ignoredFilePath).toString();

  ignoredEndpoints = new Set();
  ignored
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .filter((line) => !line.trim().startsWith('#'))
    .forEach((line) => {
      ignoredEndpoints.add(line);
    });
}
