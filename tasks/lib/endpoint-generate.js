/**
 * @import { Endpoint, GeneratedCommand } from './endpoint.types.js'
 */
import { kebabCase, pascalCase } from 'change-case';
import path from 'node:path';
import { SRC_DIR } from './config.js';

/**
 * @param {Endpoint} endpoint
 * @returns {boolean}
 */
function hasPotentialRequestBody(endpoint) {
  const method = endpoint.method;
  return method === 'post' || method === 'put' || method === 'patch';
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
 * @param {string} target
 * @param {boolean} composite
 * @returns {{className: string, classImport: string}}
 */
function getBaseCommand(target, composite) {
  if (target === 'cc-api') {
    if (composite) {
      return {
        className: 'CcApiCompositeCommand',
        classImport: '../../lib/cc-api-command.js',
      };
    } else {
      return {
        className: 'CcApiSimpleCommand',
        classImport: '../../lib/cc-api-command.js',
      };
    }
  } else {
    if (composite) {
      throw new Error('Not implemented');
    }
    return {
      className: `${pascalCase(target)}Command`,
      classImport: `../../lib/${target}-command.js`,
    };
  }
}

/**
 * @param {string} target
 * @param {Endpoint} endpoint
 * @param {string} namespace
 * @param {string} className
 * @param {boolean} composite
 * @param {boolean} autoOwner
 * @returns {string}
 */
function getClassContent(target, endpoint, namespace, className, composite, autoOwner) {
  const baseCommand = getBaseCommand(target, composite);
  const hasInput = hasInputParams(endpoint);
  const hasOutput = hasPotentialResponseBody(endpoint);
  const inputInterface = `${className}Input`;
  const outputInterface = hasOutput ? `${className}Output` : 'void';

  const jsDocImports = [];
  const ioImports = [];
  if (hasInput) {
    ioImports.push(inputInterface);
  }
  if (hasOutput) {
    ioImports.push(outputInterface);
  }
  if (ioImports.length > 0) {
    jsDocImports.push(` * @import { ${ioImports.join(', ')} } from './${kebabCase(className)}.types.js';`);
  }
  const jsDocImportsString =
    jsDocImports.length === 0
      ? ''
      : `/**
${jsDocImports.join('\n')}  
 */
`;

  const imports = [`import { ${baseCommand.className} } from '${baseCommand.classImport}';`];

  const baseCommandClassNameWithGenerics = `${baseCommand.className}<${hasInput ? inputInterface : 'void'}, ${hasOutput ? outputInterface : 'void'}>`;
  const baseCommandClassNameWithUnknownGenerics = `${baseCommand.className}<?, ?>`;

  const methodsToImplement = [];

  if (composite) {
    methodsToImplement.push(`/** @type {${baseCommandClassNameWithGenerics}['compose']} */
  async compose(params, composer) {
  }`);
  } else {
    const method = endpoint.method.toLowerCase();
    const methodUtilFunctionName = method === 'delete' ? 'delete_' : method;
    const needPathSafeUrl = endpoint.normalizedPath.includes(':XXX');
    const pathParam = `${needPathSafeUrl ? 'safeUrl' : ''}\`${endpoint.normalizedPath}\``;
    const requestParamsCall = hasPotentialRequestBody(endpoint)
      ? `${methodUtilFunctionName}(${pathParam}, {})`
      : `${methodUtilFunctionName}(${pathParam})`;

    imports.push(`import { ${methodUtilFunctionName} } from '../../../../lib/request/request-params-builder.js';`);
    if (needPathSafeUrl) {
      imports.push(`import { safeUrl } from '../../../../lib/utils.js';`);
    }

    methodsToImplement.push(`/** @type {${baseCommandClassNameWithGenerics}['toRequestParams']} */
  toRequestParams(params) {
    return ${requestParamsCall};
  }`);

    if (method === 'get') {
      methodsToImplement.push(`/** @type {${baseCommandClassNameWithGenerics}['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }`);
    }

    if (autoOwner) {
      methodsToImplement.push(`/** @type {${baseCommandClassNameWithUnknownGenerics}['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
    };
  }`);
    }
  }

  const tags = [
    ` * @extends {${baseCommandClassNameWithGenerics}}`,
    ` * @endpoint ${endpoint.id}`,
    ` * @group ${namespace}`,
  ];

  if (endpoint.normalizedPath.startsWith('/v2/')) {
    tags.push(' * @version 2');
  } else if (endpoint.normalizedPath.startsWith('/v4/')) {
    tags.push(' * @version 4');
  }

  return `${jsDocImportsString}${imports.join('\n')}

/**
 * 
${tags.join('\n')}
 */
export class ${className} extends ${baseCommand.className} {
${methodsToImplement.join('\n\n')}
}
`;
}

/**
 * @param {string} target
 * @param {Endpoint} endpoint
 * @param {string} className
 * @param {boolean} autoOwner
 * @returns {string}
 */
function getTypeContent(target, endpoint, className, autoOwner) {
  const inputInterface = `${className}Input`;
  const outputInterface = `${className}Output`;

  if (autoOwner && endpoint.normalizedPath.includes('/organisations/:XXX/applications/:XXX')) {
    return `import { ApplicationId } from '../../types/cc-api.types.js';

export interface ${inputInterface} extends ApplicationId {}

export interface ${outputInterface} {}
`;
  }

  if (autoOwner && endpoint.normalizedPath.includes('/organisations/:XXX/addons/:XXX')) {
    return `import { AddonId } from '../../types/cc-api.types.js';

export interface ${inputInterface} extends AddonId {}

export interface ${outputInterface} {}
`;
  }

  return `export interface ${inputInterface} {}

export interface ${outputInterface} {}
`;
}

/**
 * @param {string} target
 * @param {string} namespace
 * @param {string} commandClassName
 * @param {boolean} composite
 * @param {boolean} autoOwner
 * @param {Endpoint} endpoint
 * @returns {GeneratedCommand}
 */
export function generateCommand(target, namespace, commandClassName, composite, autoOwner, endpoint) {
  const className = `${commandClassName}Command`;
  const commandBaseFileName = kebabCase(className);
  const commandOutputDir = path.join(SRC_DIR, `./clients/${target}/commands/${kebabCase(namespace)}`);
  const classOutputPath = path.join(commandOutputDir, `${commandBaseFileName}.js`);
  const typesOutputPath = path.join(commandOutputDir, `${commandBaseFileName}.types.d.ts`);
  const classContent = getClassContent(target, endpoint, namespace, className, composite, autoOwner);
  const typesContent = getTypeContent(target, endpoint, className, autoOwner);

  return {
    className,
    classOutputPath,
    classContent,
    typesOutputPath,
    typesContent,
  };
}
