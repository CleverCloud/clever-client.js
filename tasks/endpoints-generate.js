import { kebabCase, pascalCase } from 'change-case';
import fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { SOURCES, SRC_DIR, WORKING_DIR } from './lib/config.js';
import { parseCommandsList } from './lib/endpoint-list.js';
import { parseEndpoints } from './lib/endpoint-parse.js';
import { confirm } from './lib/prompt.js';
import { getSourceFileObject } from './lib/source-get.js';

/**
 * @typedef {import('./lib/endpoint.types.js').EndpointsSource} EndpointsSource
 * @typedef {import('./lib/endpoint.types.js').Endpoint} Endpoint
 */

/**
 * @param {Endpoint} endpoint
 * @returns {boolean}
 */
function hasPotentialRequestBody(endpoint) {
  const method = endpoint.method;
  return method === 'post' || method === 'put' || method === 'delete' || method === 'patch';
}

/**
 * @param {Endpoint} endpoint
 * @returns {boolean}
 */
function hasPotentialResponseBody(endpoint) {
  return endpoint.method !== 'head' && endpoint.response?.statusCode !== 204;
}

/**
 * @param {Endpoint} endpoint
 * @returns {boolean}
 */
function hasInputParams(endpoint) {
  return endpoint.pathParams?.length > 0 || endpoint.queryParams?.length > 0 || endpoint.requestBody != null;
}

/**
 * @param {EndpointsSource} source
 * @param {Endpoint} endpoint
 * @param {string} className
 * @returns {string}
 */
function getClassContent(source, endpoint, className) {
  const abstractCommandClassName = `Abstract${pascalCase(source.target)}Command`;
  const hasInput = hasInputParams(endpoint);
  const hasOutput = hasPotentialResponseBody(endpoint);
  const inputInterface = `${className}Input`;
  const outputInterface = hasOutput ? `${className}Output` : 'void';
  const typesImport = `./${kebabCase(className)}.types.js`;
  const method = endpoint.method.toLowerCase();
  const methodUtilFunctionName = method === 'delete' ? '_delete' : method;
  const requestParamsCall = hasPotentialRequestBody(endpoint)
    ? `${methodUtilFunctionName}(\`\`, {})`
    : `${methodUtilFunctionName}(\`\`)`;

  const typedefs = [];
  if (hasInput) {
    typedefs.push(` * @typedef {import('${typesImport}').${inputInterface}} ${inputInterface}`);
  }
  if (hasOutput) {
    typedefs.push(` * @typedef {import('${typesImport}').${outputInterface}} ${outputInterface}`);
  }
  typedefs.push(` * @typedef {import('../../types/request.types.js').CcRequestParams} CcRequestParams`);

  const constructor = hasInput
    ? `/**
   * @param {${inputInterface}} input
   */
  constructor(input) {
    super();
    this._input = input;
  }
  `
    : '';

  return `import { ${methodUtilFunctionName} } from '../../lib/request/request-params-builder.js';
import { ${abstractCommandClassName} } from './abstract-${source.target}-command.js';

/**
${typedefs.join('\n')}
 */

/**
 * @endpoint ${endpoint.id}
 * @extends {${abstractCommandClassName}<${outputInterface}>}
 */
export class ${className} extends ${abstractCommandClassName} {
  ${constructor}
  /**
   * @returns {Partial<CcRequestParams>}
   */
  toRequestParams() {
    return ${requestParamsCall};
  }
}
`;
}

/**
 * @param {EndpointsSource} source
 * @param {Endpoint} endpoint
 * @param {string} className
 * @returns {string}
 */
function getTypeContent(source, endpoint, className) {
  const inputInterface = `${className}Input`;
  const outputInterface = `${className}Output`;

  return `export interface ${inputInterface} {}

export interface ${outputInterface} {}  
`;
}

async function run() {
  let count = 0;

  for (let source of SOURCES) {
    console.log(`${styleText(['bold', 'underline'], `Processing source ${source.id}...`)}`);

    //-- parse commands ------

    const commandsFilePath = path.join(WORKING_DIR, `./commands/${source.id}.csv`);

    if (!fs.existsSync(commandsFilePath)) {
      console.log(
        `${styleText('yellow', `! Cannot find commands file ${commandsFilePath}.`)}. You must generate it with \`endpoints-list\` tool before.`,
      );
      continue;
    }

    console.log(`${styleText('blue', `▶ Reading commands from file ${commandsFilePath}...`)}`);
    const commands = Array.from(parseCommandsList(commandsFilePath).entries()).map(
      ([endpointId, commandClassName]) => ({ endpointId, commandClassName }),
    );
    console.log(`${styleText('gray', `> Found ${commands.length} command(s).`)}`);

    //-- parse endpoints ------

    console.log();
    console.log(`${styleText('blue', `▶ Parsing endpoints...`)}`);
    const openapi = await getSourceFileObject(source);
    const endpoints = await parseEndpoints(openapi, source.pathPrefix);
    console.log(`${styleText('gray', `> Done.`)}`);

    //-- generate command classes and types ------

    console.log();
    console.log(`${styleText('blue', `▶ Generating command classes...`)}`);
    let skippedCommandsCount = 0;
    const commandClasses = commands
      .map(({ endpointId, commandClassName }) => {
        if (commandClassName.trim().length === 0) {
          console.log(`${styleText('yellow', `! ${endpointId} will be skipped because no class name is proposed`)}`);
          skippedCommandsCount++;
          return null;
        }

        const endpoint = endpoints[endpointId];
        const className = `${commandClassName}Command`;
        const classContent = getClassContent(source, endpoint, className);
        const classOutputPath = path.join(SRC_DIR, `./${source.target}/commands/${kebabCase(className)}.js`);
        const typesContent = getTypeContent(source, endpoint, className);
        const typesOutputPath = path.join(SRC_DIR, `./${source.target}/commands/${kebabCase(className)}.types.d.ts`);

        return {
          className,
          classContent,
          classOutputPath,
          typesContent,
          typesOutputPath,
        };
      })
      .filter((o) => o != null);
    console.log(
      styleText(
        'gray',
        `> Found ${commandClasses.length} command(s) to generate and ${skippedCommandsCount} command(s) with no command name.`,
      ),
    );

    //-- writing files ------
    if (commandClasses.length > 0) {
      console.log();
      console.log(`${styleText('blue', `▶ Writing command files...`)}`);
      commandClasses.forEach(({ className, classContent, classOutputPath, typesContent, typesOutputPath }) => {
        console.log(styleText('gray', `[${className}] ${classOutputPath}`));
        fs.writeFileSync(classOutputPath, classContent);
        fs.writeFileSync(typesOutputPath, typesContent);
        count++;
      });
      console.log(styleText('gray', `> Done.`));
    }

    console.log();
  }

  console.log(`${styleText('green', `✔ ${count} command(s) generated`)}`);
}

//-- ------

console.log(styleText(['bold', 'underline', 'italic'], 'Clever Client commands generation'));
console.log('-> This tool takes all commands defined in CSV file and generate commands files');
console.log('-> * one file for the command');
console.log('-> * one file for the types');
console.log('-> It will generate only scaffolding code: implementation needs to be finished manually');
console.log('-> You must run `endpoints-list` tool before');
console.log('-> Every file will be overridden, and no files will be deleted');
console.log('---------------------------------------------------------------------------------------');

if (await confirm('Do you want to continue')) {
  console.log();
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
