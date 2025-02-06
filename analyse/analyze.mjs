import { getApiCalls } from './lib.mjs';
import { globbySync } from 'globby';

if (process.argv.length !== 3) {
  console.error('Usage: node analyze-script "GLOB_PATTERN"');
  process.exit(1);
}

const [globPattern] = process.argv.slice(2);
const projetDir = process.cwd().split('/').pop();
const sourceFilepaths = globbySync(globPattern);

const apiCalls = getApiCalls(projetDir, sourceFilepaths);

console.log(JSON.stringify(apiCalls));
