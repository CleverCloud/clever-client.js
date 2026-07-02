import fs from 'fs-extra';
import path from 'path';
import { CACHE_DIR } from './config.ts';
import type { EndpointsSource } from './endpoint.types.ts';

async function fetchFileAndCache(url: string, cachePath: string): Promise<object> {
  const existsInCache = await fs.pathExists(cachePath);

  if (existsInCache) {
    return fs.readJson(cachePath);
  }

  const openapi = await fetch(url).then((response) => response.json());
  fs.outputJsonSync(cachePath, openapi, { spaces: 2 });

  return openapi;
}

export async function getSourceFileObject(source: EndpointsSource): Promise<object> {
  if (source.type === 'file') {
    return fs.readJson(source.path);
  }
  if (source.type === 'url') {
    const cachePath = path.join(CACHE_DIR, `./${source.id}.json`);
    return fetchFileAndCache(source.url, cachePath);
  }
  throw new Error(`Unsupported source ${JSON.stringify(source)}`);
}
