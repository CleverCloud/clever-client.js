import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dts } from 'rollup-plugin-dts';
import { globSync } from 'tinyglobby';

const BUILD_DIR = './build';
const DIST_DIR = './dist';
const TYPES_DIR = path.join(DIST_DIR, 'types');
const TS_FILE = path.join(BUILD_DIR, 'index.ts');
const JS_FILE = path.join(DIST_DIR, 'index.js');
const CLIENTS = ['api', 'auth-backend', 'redis-http'];

function cleanup() {
  fs.rmSync(BUILD_DIR, { recursive: true });
  fs.rmSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// barrel imports
function getBarrelExports() {
  return [
    ...CLIENTS.map((client) => `export * from '../src/clients/${client}/index.js'`),
    'export * from "../src/utils/index.js"',
  ];
}

// js barrel file
function generateIndexJs() {
  fs.writeFileSync(JS_FILE, getBarrelExports().join('\n'));
}

// ts barrel fil just for full types generation
function generateIndexTs() {
  const typesImports = globSync('src/**/*.d.ts').map(
    (file) => `export * from '${path.relative(BUILD_DIR, file.replace(new RegExp('\\.d\\.ts$'), '.js'))}'`,
  );
  const content = [...getBarrelExports(), ...typesImports].join('\n');
  fs.writeFileSync(TS_FILE, content);
}

function getEntries() {
  cleanup();

  generateIndexJs();
  generateIndexTs();

  const staticEntries = Object.fromEntries(
    globSync(['esm/**/*.js', 'esm/**/*.d.ts', 'src/**/*.d.ts']).map((file) => {
      return [
        file.replace(new RegExp('\\.d\\.ts$'), '').replace(new RegExp('\\.js$'), ''),
        fileURLToPath(new URL(file, import.meta.url)),
      ];
    }),
  );

  return {
    ...staticEntries,
    'src/index': fileURLToPath(new URL(TS_FILE, import.meta.url)),
  };
}

export default [
  {
    input: getEntries(),
    output: {
      format: 'es',
      dir: TYPES_DIR,
      preserveModules: true,
    },
    plugins: [dts()],
  },
];
