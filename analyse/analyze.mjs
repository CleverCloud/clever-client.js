import path from 'node:path';
import { getApiCalls } from './lib.mjs';
import { globbySync } from 'globby';

/**
 * @param {string} option
 * @param {number} i
 */
function getOptionValue (option, i) {
  const next = i + 1;
  if (next > process.argv.length - 1) {
    throw new Error(`Invalid command: no value found for option "${option}"`);
  }
  return process.argv[next];
}

/**
 * @returns {{input: Array<string>, format: 'json'|'md'}}
 */
function parseArgs () {
  const input = [];
  let format = 'json';

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '-i') {
      input.push(getOptionValue(arg, i));
      i++;
    }
    if (arg === '-f') {
      format = getOptionValue(arg, i);
      i++;
    }
  }

  if (input.length === 0) {
    throw new Error('Invalid command: no source input specified. Use "-i {DIR}" to include sources to scan.');
  }
  if (format !== 'json' && format !== 'md') {
    throw new Error(`Invalid command: invalid format "${format}". Use "-f json" or "-f md".`);
  }

  return {
    input,
    format,
  };
}

/** @type {{input: Array<string>, format: 'json'|'md'}} */
let args;
try {
  args = parseArgs();
}
catch (e) {
  console.error(e.message);
  process.exit(1);
}

const apiCalls = args.input.map((input) => {
  const projectDir = path.resolve(process.cwd(), input);
  return getApiCalls(projectDir, globbySync(projectDir + '/src/**/*.js'));
});

console.log(JSON.stringify(apiCalls));
