import path from 'node:path';
// todo: remove that when we use a version of Node.js >= 23.5.0 (we can ignore because the feature was backported to version 22.13.0)
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { styleText } from 'node:util';
import { globSync } from 'tinyglobby';
import { getApiCalls, sortAndGroupByCall } from './lib/api-analyze.js';

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
function getOptionValue(option, i) {
  const next = i + 1;
  if (next > process.argv.length - 1) {
    throw new Error(`Invalid command: no value found for option "${option}"`);
  }
  return process.argv[next];
}

/**
 * @returns {Options}
 */
function parseArgs() {
  const input = [];
  let format = 'json';
  let withLegacyClient = false;
  let apiVersion = null;

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
    if (arg === '-v') {
      apiVersion = getOptionValue(arg, i);
      i++;
    }

    if (arg === '-h' || arg === '--help') {
      const scriptName = path.basename(import.meta.url);
      console.log(styleText('bold', 'Clever Cloud API calls analysis script'));
      console.log();
      console.log(styleText('italic', 'This tool scans JS code and detects all usage of Clever Cloud APIs.'));
      console.log();
      console.log(`node ${scriptName} -i DIR [-f FORMAT] [-l]`);
      console.log();
      console.log(styleText('bold', 'USAGE:'));
      console.log();
      console.log('-h, --help       to display this help');
      console.log('-i DIR           to include sources to scan (can be set multiple times)');
      console.log('-f `json`|`md`   to define output format: json or markdown (`json` by default)');
      console.log('-l               to collect only API calls done with legacy client');
      console.log('-v `v2`|`v4`     to filter by API calls version (no filter by default)');
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

  if (apiVersion != null && apiVersion !== 'v2' && apiVersion !== 'v4') {
    throw new Error(`Invalid command: invalid version "${apiVersion}". Use "-v v2" or "-v v4".`);
  }

  return {
    input,
    format,
    withLegacyClient,
    apiVersion,
  };
}

/**
 * @param {Array<Array<ApiCall>>} apiCallsGroupedAndSorted
 */
function printJson(apiCallsGroupedAndSorted) {
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
function printMarkdown(apiCallsGroupedAndSorted) {
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
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const apiCalls = args.input.flatMap((input) => {
  const projectDir = path.relative(process.cwd(), input);
  return getApiCalls(projectDir, globSync(projectDir + '/src/**/*.js'));
});

let filteredApiCalls = args.withLegacyClient ? apiCalls.filter((apiCall) => apiCall.withLegacyClient) : apiCalls;
if (args.apiVersion != null) {
  filteredApiCalls = filteredApiCalls.filter((apiCall) => apiCall.version === `/${args.apiVersion}`);
}
const apiCallsGroupedAndSorted = sortAndGroupByCall(filteredApiCalls);

if (args.format === 'md') {
  printMarkdown(apiCallsGroupedAndSorted);
} else {
  printJson(apiCallsGroupedAndSorted);
}
