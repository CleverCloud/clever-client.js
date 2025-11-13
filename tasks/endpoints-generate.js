/**
 * @import { EndpointsSource, Endpoint, GeneratedCommand } from './lib/endpoint.types.js'
 */
import fs from 'node:fs';
import path from 'node:path';
// todo: remove that when we use a version of Node.js >= 23.5.0 (we can ignore because the feature was backported to version 22.13.0)
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { styleText } from 'node:util';
import { SOURCES, SRC_DIR, WORKING_DIR } from './lib/config.js';
import { generateCommand } from './lib/endpoint-generate.js';
import { flattenEndpointsBySourceTarget, parseCommandsList } from './lib/endpoint-list.js';
import { parseEndpoints } from './lib/endpoint-parse.js';
import { formatJsCode, formatTsCode } from './lib/format-code.js';
import { confirm } from './lib/prompt.js';
import { getSourceFileObject } from './lib/source-get.js';

/**
 * @param {GeneratedCommand} generatedCommand
 * @param {boolean} [force]
 */
async function save(generatedCommand, force = false) {
  console.log(
    styleText('gray', `Writing command ${generatedCommand.className} to ${generatedCommand.classOutputPath}`),
  );
  if (!force && fs.existsSync(generatedCommand.classOutputPath)) {
    console.log(styleText('yellow', `! ${generatedCommand.classOutputPath} already exists. Skipping.`));
    return false;
  }
  fs.mkdirSync(path.dirname(generatedCommand.classOutputPath), { recursive: true });
  fs.writeFileSync(generatedCommand.classOutputPath, await formatJsCode(generatedCommand.classContent));
  fs.writeFileSync(generatedCommand.typesOutputPath, await formatTsCode(generatedCommand.typesContent));
  return true;
}

async function run() {
  let totalCommands = 0;

  /** @type {Map<EndpointsSource, Array<Endpoint>>} */
  const endpointsBySource = new Map();

  console.log(`${styleText(['bold', 'underline'], `Analyzing sources...`)}`);
  for (let source of SOURCES) {
    console.log(`${styleText('blue', `▶ Analyzing source ${source.id}...`)}`);

    // fetch source
    const openapi = await getSourceFileObject(source);
    // parse it
    const endpoints = await parseEndpoints(openapi, source.pathPrefix);

    const endpointsArray = Object.values(endpoints);
    endpointsBySource.set(source, endpointsArray);

    console.log(`> Found ${endpointsArray.length} endpoint(s)`);
  }

  const endpointsBySourceTarget = flattenEndpointsBySourceTarget(endpointsBySource);
  for (let [sourceTarget, endpoints] of endpointsBySourceTarget.entries()) {
    console.log();
    console.log(`${styleText(['bold', 'underline'], `Processing target ${sourceTarget}...`)}`);

    /** @type {Map<string, Endpoint>} */
    const endpointsMap = new Map();
    endpoints.forEach(({ endpoint }) => {
      endpointsMap.set(endpoint.id, endpoint);
    });

    const commandsListFilePath = path.join(WORKING_DIR, `./commands/${sourceTarget}.csv`);

    console.log(`${styleText('blue', `▶ Reading commands from file ${commandsListFilePath}...`)}`);
    const commands = Array.from(parseCommandsList(commandsListFilePath).values());
    console.log(`> Found ${commands.length} command(s).`);

    console.log(`${styleText('blue', `▶ Generating command classes...`)}`);
    let skippedCommandsCount = 0;
    const generatedCommands = commands
      .filter(({ commandClassName }) => commandClassName !== 'IGNORE') // this means that this endpoint is to be ignored deliberately
      .filter(({ commandClassName }) => commandClassName !== 'PERSONAL_ORGA') // this means that this is a /self/ endpoint with an /orga/:XXX/ alternative
      .filter(({ commandClassName }) => !commandClassName.endsWith('*')) // this means that another command will handle this endpoint
      .map((command) => {
        if (command.commandClassName.trim().length === 0) {
          skippedCommandsCount++;
          return null;
        }

        const endpoint = endpointsMap.get(command.endpointId);
        return generateCommand(
          sourceTarget,
          command.namespace,
          command.commandClassName,
          command.composite,
          command.autoOwner,
          endpoint,
        );
      })
      .filter((o) => o != null);

    console.log(`> Found ${generatedCommands.length} command(s) to generate.`);
    if (skippedCommandsCount > 0) {
      console.log(
        styleText(
          'gray',
          `  ${skippedCommandsCount} command(s) will be skipped because no command name was specified.`,
        ),
      );
    }

    //-- barrel file
    const barrelFileDir = path.join(SRC_DIR, `./clients/${sourceTarget}/commands`);
    const barrelFilePath = path.join(barrelFileDir, `index.js`);
    const barrelFileContent = generatedCommands
      .map(
        (command) => `export {${command.className}} from './${path.relative(barrelFileDir, command.classOutputPath)}';`,
      )
      .join('\n');

    //-- writing files ------
    if (generatedCommands.length > 0) {
      let count = 0;
      console.log(`${styleText('blue', `▶ Writing command files...`)}`);
      for (const generatedCommand of generatedCommands) {
        if (await save(generatedCommand)) {
          count++;
          totalCommands++;
        }
      }
      console.log(`> ${count} command(s) written to disk.`);
      console.log(`${styleText('blue', `▶ Writing barrel file`)}`);
      fs.writeFileSync(barrelFilePath, await formatJsCode(barrelFileContent));
      console.log(`> Barrel file ${barrelFilePath} written to disk.`);
    }
  }

  console.log();
  console.log(`${styleText('green', `✔ ${totalCommands} command(s) generated`)}`);
}

//-- ------

console.log(styleText(['bold', 'underline', 'italic'], 'Clever Client commands generation'));
console.log('-> This tool takes all commands defined in CSV file and generate commands files');
console.log('-> * one file for the command');
console.log('-> * one file for the types');
console.log('-> It will generate only scaffolding code: implementation needs to be finished manually');
console.log('-> You must run `endpoints-list` tool before');
console.log('---------------------------------------------------------------------------------------');

if (await confirm('Do you want to continue')) {
  console.log();
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
