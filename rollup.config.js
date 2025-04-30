import clean from '@rollup-extras/plugin-clean';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { dts } from 'rollup-plugin-dts';
import { globSync } from 'tinyglobby';

function getEntries() {
  const pkg = fs.readJsonSync('package.json');

  const globPatterns = Object.entries(pkg.exports).map(([, value]) => {
    return value.default.replace(/\*/, '**/*');
  });

  const staticEntries = Object.fromEntries(
    globSync([
      ...globPatterns,
      // our handwritten types
      'src/**/*.d.ts',
      'esm/**/*.d.ts',
    ]).map((file) => {
      return [
        file.replace(new RegExp('\\.d\\.ts$'), '').replace(new RegExp('\\.js$'), ''),
        fileURLToPath(new URL(file, import.meta.url)),
      ];
    }),
  );

  return staticEntries;
}

export default [
  {
    input: getEntries(),
    output: {
      format: 'es',
      dir: 'dist/types',
      preserveModules: true,
    },
    plugins: [clean(), dts()],
  },
];
