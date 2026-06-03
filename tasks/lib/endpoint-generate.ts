import { kebabCase, pascalCase } from 'change-case';
import path from 'node:path';
import { SRC_DIR } from './config.ts';
import type { Endpoint, GeneratedCommand } from './endpoint.types.ts';

function hasPotentialRequestBody(endpoint: Endpoint): boolean {
  const method = endpoint.method;
  return method === 'post' || method === 'put' || method === 'patch';
}

function hasPotentialResponseBody(endpoint: Endpoint): boolean {
  return endpoint.method !== 'head' && endpoint.response?.statusCode !== 204;
}

function hasInputParams(endpoint: Endpoint): boolean {
  return endpoint.pathParams?.length > 0 || endpoint.queryParams?.length > 0 || endpoint.requestBody != null;
}

function getBaseCommand(target: string, composite: boolean): { className: string; classImport: string } {
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

function getClassContent(
  target: string,
  endpoint: Endpoint,
  namespace: string,
  className: string,
  composite: boolean,
  autoOwner: boolean,
): string {
  const baseCommand = getBaseCommand(target, composite);
  const hasInput = hasInputParams(endpoint);
  const hasOutput = hasPotentialResponseBody(endpoint);
  const inputInterface = `${className}Input`;
  const outputInterface = `${className}Output`;
  const inputType = hasInput ? inputInterface : 'void';
  const outputType = hasOutput ? outputInterface : 'void';

  const valueImports = [`import { ${baseCommand.className} } from '${baseCommand.classImport}';`];
  const typeImports: Array<string> = [];

  const ioImports: Array<string> = [];
  if (hasInput) {
    ioImports.push(inputInterface);
  }
  if (hasOutput) {
    ioImports.push(outputInterface);
  }
  if (ioImports.length > 0) {
    typeImports.push(`import type { ${ioImports.join(', ')} } from './${kebabCase(className)}.types.js';`);
  }

  const methodsToImplement: Array<string> = [];

  if (composite) {
    typeImports.push(`import type { CcApiComposer } from '../../types/cc-api.types.js';`);
    methodsToImplement.push(`async compose(params: ${inputType}, composer: CcApiComposer): Promise<${outputType}> {}`);
  } else {
    const method = endpoint.method.toLowerCase();
    const methodUtilFunctionName = method === 'delete' ? 'delete_' : method;
    const needPathSafeUrl = endpoint.normalizedPath.includes(':XXX');
    const pathParam = `${needPathSafeUrl ? 'safeUrl' : ''}\`${endpoint.normalizedPath}\``;
    const requestParamsCall = hasPotentialRequestBody(endpoint)
      ? `${methodUtilFunctionName}(${pathParam}, {})`
      : `${methodUtilFunctionName}(${pathParam})`;

    valueImports.push(`import { ${methodUtilFunctionName} } from '../../../../lib/request/request-params-builder.js';`);
    if (needPathSafeUrl) {
      valueImports.push(`import { safeUrl } from '../../../../lib/utils.js';`);
    }

    methodsToImplement.push(`toRequestParams(${hasInput ? `params: ${inputType}` : ''}) {
    return ${requestParamsCall};
  }`);

    if (method === 'get') {
      methodsToImplement.push(`getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }`);
    }

    if (autoOwner) {
      typeImports.push(`import type { IdResolve } from '../../types/resource-id-resolver.types.js';`);
      methodsToImplement.push(`getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }`);
    }
  }

  const tags = [` * @endpoint ${endpoint.id}`, ` * @group ${namespace}`];

  if (endpoint.normalizedPath.startsWith('/v2/')) {
    tags.push(' * @version 2');
  } else if (endpoint.normalizedPath.startsWith('/v4/')) {
    tags.push(' * @version 4');
  }

  return `${[...valueImports, ...typeImports].join('\n')}

/**
${tags.join('\n')}
 */
export class ${className} extends ${baseCommand.className}<${inputType}, ${outputType}> {
${methodsToImplement.join('\n\n')}
}
`;
}

function getTypeContent(endpoint: Endpoint, className: string, autoOwner: boolean): string {
  const inputInterface = `${className}Input`;
  const outputInterface = `${className}Output`;

  if (autoOwner && endpoint.normalizedPath.includes('/organisations/:XXX/applications/:XXX')) {
    return `import type { ApplicationId } from '../../types/cc-api.types.js';

export interface ${inputInterface} extends ApplicationId {}

export interface ${outputInterface} {}
`;
  }

  if (autoOwner && endpoint.normalizedPath.includes('/organisations/:XXX/addons/:XXX')) {
    return `import type { AddonId } from '../../types/cc-api.types.js';

export interface ${inputInterface} extends AddonId {}

export interface ${outputInterface} {}
`;
  }

  return `export interface ${inputInterface} {}

export interface ${outputInterface} {}
`;
}

export function generateCommand(
  target: string,
  namespace: string,
  commandClassName: string,
  composite: boolean,
  autoOwner: boolean,
  endpoint: Endpoint,
): GeneratedCommand {
  const className = `${commandClassName}Command`;
  const commandBaseFileName = kebabCase(className);
  const commandOutputDir = path.join(SRC_DIR, `./clients/${target}/commands/${kebabCase(namespace)}`);
  const classOutputPath = path.join(commandOutputDir, `${commandBaseFileName}.ts`);
  const typesOutputPath = path.join(commandOutputDir, `${commandBaseFileName}.types.ts`);
  const classContent = getClassContent(target, endpoint, namespace, className, composite, autoOwner);
  const typesContent = getTypeContent(endpoint, className, autoOwner);

  return {
    className,
    classOutputPath,
    classContent,
    typesOutputPath,
    typesContent,
  };
}
