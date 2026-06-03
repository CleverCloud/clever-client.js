import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist', import.meta.url));
fs.removeSync(distDir);
