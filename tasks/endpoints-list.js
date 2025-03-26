import fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { SOURCES, WORKING_DIR } from './lib/config.js';
import { parseCommandsList } from './lib/endpoint-list.js';
import { parseEndpoints } from './lib/endpoint-parse.js';
import { confirm } from './lib/prompt.js';
import { getSourceFileObject } from './lib/source-get.js';

/** @type {Array<string>} */
const CSV_HEADER = ['Endpoint id', 'Command name (without Command suffix)'];

/**
 * @param {string} sourceId
 */
function getOutputFilePath(sourceId) {
  return path.join(WORKING_DIR, `./commands/${sourceId}.csv`);
}

async function run() {
  /** @type {Map<string, Map<string, string>>} commands list by source id */
  const commandsListBySource = new Map();
  let totalCommandsCount = 0;

  console.log();
  console.log(styleText(['bold', 'underline'], 'Analysing...'));

  for (let source of SOURCES) {
    console.log(`${styleText('blue', `▶ Processing source ${source.id}...`)}`);

    // fetch source
    const openapi = await getSourceFileObject(source);

    // parse it
    const endpoints = await parseEndpoints(openapi, source.pathPrefix);

    const outputFilePath = getOutputFilePath(source.id);

    /** @type {Map<string, string>} */
    const existingCommands = fs.existsSync(outputFilePath) ? parseCommandsList(outputFilePath) : new Map();

    /** @type {Map<string, string>} */
    const mergedCommands = new Map();
    commandsListBySource.set(source.id, mergedCommands);

    let keptCount = 0;
    let commandCount = 0;
    Object.values(endpoints).forEach((endpoint) => {
      const alreadyExist = existingCommands.get(endpoint.id)?.length > 0;

      commandCount++;
      if (alreadyExist) {
        keptCount++;
      }

      mergedCommands.set(endpoint.id, alreadyExist ? existingCommands.get(endpoint.id) : '');
      totalCommandsCount++;
    });

    console.log(
      styleText(
        'gray',
        `> Found ${commandCount} commands (${keptCount} already had a command class name that were left untouched).`,
      ),
    );
  }

  // save as csv

  console.log();
  console.log(`${styleText(['bold', 'underline'], `Writing to files...`)}`);
  commandsListBySource.forEach((commands, sourceId) => {
    // output file path
    const outputFilePath = getOutputFilePath(sourceId);

    // csv
    const csv = [CSV_HEADER.join(',')];
    commands.forEach((commandClassName, endpointId) => {
      csv.push([endpointId, commandClassName].join(','));
    });

    // write file
    fs.writeFileSync(outputFilePath, csv.join('\n'));

    console.log(styleText('gray', `> ${outputFilePath}`));
  });

  console.log();
  console.log(
    `${styleText('green', `✔ Dumped ${totalCommandsCount} endpoints in ${commandsListBySource.size} file(s)`)}`,
  );
}

console.log(styleText(['bold', 'underline', 'italic'], 'Endpoints listing'));
console.log('-> This tool takes all endpoints and generate a CSV file with two columns:');
console.log('-> * First column is the endpoint id');
console.log('-> * Second column is the command class name');
console.log("-> You'll then be able to define all command class names manually.");
console.log("-> Then, you'll use the `endpoints-generate` tool to generate the client scaffolding.");
console.log('-> Note that, if a CSV file already exists, the class names will be kept unchanged.');
console.log('-------------------------------------------------------------------------------------');

if (await confirm('Do you want to continue')) {
  console.log();
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
