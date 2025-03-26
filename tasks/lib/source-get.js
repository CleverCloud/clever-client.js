import fs from 'fs-extra';
import path from 'path';
import { CACHE_DIR } from './config.js';

/**
 * @typedef {import('./endpoint.types.js').EndpointsSource} EndpointsSource
 */

/**
 * @param {string} url
 * @param {string} cachePath
 * @returns {Promise<object>}
 */
async function fetchFileAndCache(url, cachePath) {
  const existsInCache = await fs.pathExists(cachePath);

  if (existsInCache) {
    return fs.readJson(cachePath);
  }

  const openapi = await fetch(url).then((response) => response.json());
  fs.outputJsonSync(cachePath, openapi, { spaces: 2 });

  return openapi;
}

/**
 * @param {EndpointsSource} source
 * @returns {Promise<object>}
 */
export async function getSourceFileObject(source) {
  if (source.type === 'file') {
    return fs.readJson(source.path);
  }
  if (source.type === 'url') {
    const cachePath = path.join(CACHE_DIR, `./${source.id}.json`);
    return fetchFileAndCache(source.url, cachePath);
  }
  throw new Error(`Unsupported source ${source}`);
}
