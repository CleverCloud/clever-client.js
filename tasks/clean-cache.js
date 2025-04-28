import { deleteSync } from 'del';
import fs from 'fs-extra';
import { join as pathJoin } from 'node:path';
import { CACHE_PATH } from './config.js';

async function cleanCache() {
  await fs.ensureDir(CACHE_PATH);
  deleteSync(pathJoin(CACHE_PATH, '**', '*'));
}

cleanCache().catch((e) => {
  console.error(e);
  process.exit(1);
});
