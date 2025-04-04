import { styleText } from 'node:util';
import path from 'node:path';
import { getApiCalls, sortAndGroupByCall } from './lib/api-analyze.js';
import { globbySync } from 'globby';

/**
 * @typedef {Object} Options
 * @property {Array<string>} input
 * @property {'json'|'md'} format
 * @property {boolean} withLegacyClient
 */

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
 * @returns {Options}
 */
function parseArgs () {
  const input = [];
  let format = 'json';
  let withLegacyClient = false;

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
    if (arg === '-l') {
      withLegacyClient = true;
    }
    if (arg === '-h') {
      const scriptName = path.basename(import.meta.url);
      console.log(styleText('bold', 'Clever Cloud API calls analysis script'));
      console.log();
      console.log(styleText('italic', 'This tool scans JS code and detects all usage of Clever Cloud APIs.'));
      console.log();
      console.log(`node ${scriptName} -i DIR [-f FORMAT] [-l]`);
      console.log();
      console.log(styleText('bold', 'USAGE:'));
      console.log();
      console.log('-h               to display this help');
      console.log('-i DIR           to include sources to scan (can be set multiple times)');
      console.log('-f `json`|`md`   to define output format: json or markdown (`json` by default)');
      console.log('-l               to collect only API calls done with legacy client');
      console.log();
      console.log(styleText('bold', 'EXAMPLES:'));
      console.log();
      console.log(`Scan multiple directories`);
      console.log(`node ${scriptName} -i ~/dev/console3 -i ~/dev/clever-components -i ~/dev/clever-tools`);
      console.log();
      console.log(`Output in markdown format`);
      console.log(`node ${scriptName} -i ~/dev/console3 -f md`);
      console.log();
      console.log(`Collect API calls done with legacy client only`);
      console.log(`node ${scriptName} -i ~/dev/console3 -l`);
      process.exit(0);
    }
  }

  if (input.length === 0) {
    throw new Error('Invalid command: no source input specified. Use "-i DIR" to include sources to scan.');
  }
  if (format !== 'json' && format !== 'md') {
    throw new Error(`Invalid command: invalid format "${format}". Use "-f json" or "-f md".`);
  }

  return {
    input,
    format,
    withLegacyClient,
  };
}

/**
 * @param {Array<Array<ApiCall>>} apiCallsGroupedAndSorted
 */
function printJson (apiCallsGroupedAndSorted) {
  const result = {};

  for (const groupedCalls of apiCallsGroupedAndSorted) {
    const { method, path } = groupedCalls[0];
    const key = `[${method.toUpperCase()}] ${path}`;
    result[key] = groupedCalls.map((call) => `${call.filepath}:${call.line}`);
  }

  console.log(JSON.stringify(result));
}

/**
 * @param {Array<Array<ApiCall>>} apiCallsGroupedAndSorted
 */
function printMarkdown (apiCallsGroupedAndSorted) {
  console.log('# Analysis of @clevercloud/client usage');
  console.log('');

  console.log(`* Number of API calls: ${Object.values(apiCallsGroupedAndSorted).length}`);
  console.log('');

  console.log('## Details');
  console.log('');

  for (const groupedCalls of apiCallsGroupedAndSorted) {
    const { method, path } = groupedCalls[0];
    console.log(`* \`[${method.toUpperCase()}] ${path}\`:`);
    for (const { filepath, line } of groupedCalls) {
      console.log(`  * \`${filepath}:${line}\``);
    }
  }
}

/** @type {Options} */
let args;
try {
  args = parseArgs();
}
catch (e) {
  console.error(e.message);
  process.exit(1);
}

const apiCalls = args.input.flatMap((input) => {
  const projectDir = path.resolve(process.cwd(), input);
  return getApiCalls(projectDir, globbySync(projectDir + '/src/**/*.js'));
});

const filteredApiCalls = args.withLegacyClient ? apiCalls.filter((apiCall) => apiCall.withLegacyClient) : apiCalls;

const apiCallsGroupedAndSorted = sortAndGroupByCall(filteredApiCalls);

if (args.format === 'md') {
  printMarkdown(apiCallsGroupedAndSorted);
}
else {
  printJson(apiCallsGroupedAndSorted);
}
