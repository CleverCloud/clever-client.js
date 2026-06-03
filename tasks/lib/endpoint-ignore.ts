import fs from 'fs-extra';
import path from 'node:path';
import { WORKING_DIR } from './config.ts';
import type { Endpoint, EndpointsSource } from './endpoint.types.ts';

let ignoredEndpoints: Set<string>;

export function isIgnored(source: EndpointsSource, endpoint: Endpoint): boolean {
  if (ignoredEndpoints == null) {
    readIgnoredEndpoints();
  }

  return ignoredEndpoints.has(`${source.target} ${endpoint.id}`);
}

function readIgnoredEndpoints(): void {
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
