import fs from 'fs-extra';
import path from 'node:path';
import { styleText } from 'node:util';
import { SOURCES, WORKING_DIR } from './lib/config.js';
import { parseCommandsList, storeCommandsList } from './lib/endpoint-list.js';
import { parseEndpoints } from './lib/endpoint-parse.js';
import { confirm } from './lib/prompt.js';
import { getSourceFileObject } from './lib/source-get.js';

/**
 * @typedef {import('./lib/endpoint.types.js').EndpointsSource} EndpointsSource
 * @typedef {import('./lib/endpoint.types.js').Endpoint} Endpoint
 * @typedef {import('./lib/endpoint.types.js').CommandDetail} CommandDetail
 */

/**
 * @param {string} sourceId
 */
function getOutputFilePath(sourceId) {
  return path.join(WORKING_DIR, `./commands/${sourceId}.csv`);
}

/**
 * @param {Map<EndpointsSource, Array<Endpoint>>} endpointsBySource
 * @return {Map<string, Array<{sourceId: string, endpoint: Endpoint}>>}
 */
function flattenEndpointsBySourceTarget(endpointsBySource) {
  /** @type {Map<string, Array<{sourceId: string, endpoint: Endpoint}>>} */
  const result = new Map();
  endpointsBySource.forEach((endpoints, source) => {
    const toAdd = endpoints.map((endpoint) => ({ sourceId: source.id, endpoint }));
    result.set(source.target, [...(result.get(source.target) ?? []), ...toAdd]);
  });

  return result;
}

async function run() {
  /** @type {Map<string, Map<string, CommandDetail>>} commands list by source id */
  const commandsListBySourceTarget = new Map();
  let totalCommandsCount = 0;

  console.log();
  console.log(styleText(['bold', 'underline'], 'Getting api usage...')); // todo: get it by running the api-usage-analyze script instead of relying on a local file
  const apiUsageFilePath = path.join(WORKING_DIR, './cc-api-usage.json');
  const apiUsage = fs.readJsonSync(apiUsageFilePath);

  console.log();
  console.log(styleText(['bold', 'underline'], 'Analysing...'));

  /** @type {Map<EndpointsSource, Array<Endpoint>>} */
  const endpointsBySource = new Map();

  for (let source of SOURCES) {
    console.log(`${styleText('blue', `▶ Processing source ${source.id}...`)}`);

    // fetch source
    const openapi = await getSourceFileObject(source);
    // parse it
    const endpoints = await parseEndpoints(openapi, source.pathPrefix);

    const endpointsArray = Object.values(endpoints);
    endpointsBySource.set(source, endpointsArray);

    console.log(styleText('gray', `> Found ${endpointsArray.length} endpoint(s)`));
  }

  console.log();
  console.log(styleText(['bold', 'underline'], 'Merging...'));

  /** @type {Map<string, Array<{sourceId: string, endpoint: Endpoint}>>} */
  const endpointsBySourceTarget = flattenEndpointsBySourceTarget(endpointsBySource);
  endpointsBySourceTarget.forEach((endpoints, sourceTarget) => {
    console.log(`${styleText('blue', `▶ Processing source target ${sourceTarget}...`)}`);

    const outputFilePath = getOutputFilePath(sourceTarget);

    /** @type {Map<string, CommandDetail>} */
    const existingCommands = fs.existsSync(outputFilePath) ? parseCommandsList(outputFilePath) : new Map();

    /** @type {Map<string, CommandDetail>} */
    const mergedCommands = new Map();
    commandsListBySourceTarget.set(sourceTarget, mergedCommands);

    let keptCount = 0;
    let commandCount = 0;
    Object.values(endpoints).forEach(({ sourceId, endpoint }) => {
      const alreadyExist = existingCommands.get(endpoint.id)?.commandClassName.trim().length > 0;
      const comment = existingCommands.get(endpoint.id)?.comment ?? '';

      commandCount++;
      if (alreadyExist) {
        keptCount++;
      }

      const isUsed = apiUsage[endpoint.id] != null;

      mergedCommands.set(endpoint.id, {
        sourceId,
        endpointId: endpoint.id,
        isUsed,
        commandClassName: alreadyExist ? existingCommands.get(endpoint.id).commandClassName : '',
        comment,
      });
      totalCommandsCount++;
    });

    console.log(
      styleText(
        'gray',
        `> Found ${commandCount} commands (${keptCount} already had a command class name that were left untouched).`,
      ),
    );
  });

  // save as csv

  console.log();
  console.log(`${styleText(['bold', 'underline'], `Writing to files...`)}`);
  commandsListBySourceTarget.forEach((commands, sourceId) => {
    const outputFilePath = getOutputFilePath(sourceId);
    storeCommandsList(outputFilePath, commands);
    console.log(styleText('gray', `> ${outputFilePath}`));
  });

  console.log();
  console.log(
    `${styleText('green', `✔ Dumped ${totalCommandsCount} endpoints in ${commandsListBySourceTarget.size} file(s)`)}`,
  );
}

console.log(styleText(['bold', 'underline', 'italic'], 'Endpoints listing'));
console.log('-> This tool takes all endpoints and generate one CSV file per source api target:');
console.log('-> * column 1: the source id');
console.log('-> * column 2: the endpoint id');
console.log('-> * column 3: the command class name (to be defined manually)');
console.log('-> * column 4: a free comment');
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
