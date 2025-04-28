import { fileURLToPath } from 'node:url';
import clear from 'rollup-plugin-clear';
import { dts } from 'rollup-plugin-dts';
import { globSync } from 'tinyglobby';

const OUT_DIR = './types';
export default [
  {
    input: Object.fromEntries(
      globSync(['esm/**/*.js', 'esm/**/*.d.ts']).map((file) => {
        return [
          file.replace('esm/', '').replace('.d.ts', '').replace('.js', ''),
          fileURLToPath(new URL(file, import.meta.url)),
        ];
      }),
    ),
    output: {
      format: 'es',
      dir: OUT_DIR,
    },
    plugins: [clear({ targets: [OUT_DIR] }), dts()],
  },
];
