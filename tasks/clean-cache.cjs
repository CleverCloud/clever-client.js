'use strict';

const del = require('del');
const fs = require('fs-extra');
const pathJoin = require('path').join;
const { CACHE_PATH } = require('./config.cjs');

async function cleanCache() {
  await fs.ensureDir(CACHE_PATH);
  await del(pathJoin(CACHE_PATH, '**', '*'));
}

cleanCache().catch((e) => {
  console.error(e);
  process.exit(1);
});
