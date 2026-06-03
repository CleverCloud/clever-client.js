import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { globSync } from 'tinyglobby';

// Copies the legacy `esm/` type sidecars into the build output.
//
// `tsc` emits a `.d.ts` for every `.js`/`.ts` file it compiles, but it does NOT
// copy standalone hand-written `*.types.d.ts` sidecars into the output dir. All
// of `src/` has been migrated to `*.types.ts` (compiled by tsc), so only the
// legacy `esm/` client still ships hand-written `.types.d.ts` sidecars; copy
// them into `dist/` so the emitted declarations' `./foo.types.js` imports
// resolve. Remove this script once `esm/` is converted (or dropped).

const root = fileURLToPath(new URL('..', import.meta.url));
const sidecars = globSync(['esm/**/*.types.d.ts'], { cwd: root });

for (const file of sidecars) {
  fs.copySync(`${root}/${file}`, `${root}/dist/${file}`);
}

console.log(`Copied ${sidecars.length} type sidecar(s) into dist/`);
