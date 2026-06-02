import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { globSync } from 'tinyglobby';

// Transitional build step for the TypeScript migration.
//
// `tsc` emits a `.d.ts` for every `.js`/`.ts` file it compiles, but it does NOT
// copy standalone hand-written `*.types.d.ts` sidecars into the output dir. Until
// every sidecar is renamed to `*.types.ts` (and thus compiled by tsc), copy the
// remaining ones into `dist/` so the emitted declarations' `./foo.types.js`
// imports resolve. Remove this script once no `*.types.d.ts` files remain.

const root = fileURLToPath(new URL('..', import.meta.url));
const sidecars = globSync(['src/**/*.types.d.ts', 'esm/**/*.types.d.ts'], { cwd: root });

for (const file of sidecars) {
  fs.copySync(`${root}/${file}`, `${root}/dist/${file}`);
}

console.log(`Copied ${sidecars.length} type sidecar(s) into dist/`);
