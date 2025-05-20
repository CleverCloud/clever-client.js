import parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import fs from 'fs';
import path from 'node:path';

/**
 * @typedef {import('@babel/types').Program} Program
 * @typedef {import('@babel/types').Node} Node
 * @typedef {import('@babel/types').ImportDeclaration} ImportDeclaration
 * @typedef {import('@babel/types').CallExpression} CallExpression
 * @typedef {import('@babel/types').VariableDeclaration} VariableDeclaration
 * @typedef {import('@babel/types').ExportNamedDeclaration} ExportNamedDeclaration
 */

/**
 * @typedef {object} ApiCall
 * @property {string} method
 * @property {string} path
 * @property {string} filepath
 * @property {number} line
 * @property {boolean} withLegacyClient
 * @property {string} version
 */

/**
 * @param {string} projectDir
 * @param {Array<string>} sourceFilepaths
 * @return {Array<ApiCall>}
 */
export function getApiCalls(projectDir, sourceFilepaths) {
  /** @type {Array<ApiCall>} */
  const allApiCalls = [];

  for (const localFilepath of sourceFilepaths) {
    const filepath = path.relative(process.cwd(), localFilepath);

    try {
      const { sourceCode, ast } = getAst(localFilepath);
      const legacyCalls = findCleverClientLegacyCalls(ast, sourceCode);
      for (const { method, path, line } of legacyCalls) {
        allApiCalls.push({ method, path, filepath, line, withLegacyClient: true, version: '/v2' });
      }

      const importsAndRequireByFunctionName = findCleverClientImportsAndRequire(projectDir, ast);

      const newCalls = findCleverClientNewCalls(ast);
      for (const { functionName, line } of newCalls) {
        const importOrRequireDetails = importsAndRequireByFunctionName[functionName];
        if (importOrRequireDetails != null) {
          const methodsAndPathsByFunctionName = getCleverClientMethodsAndPathsByFunctionName(
            importOrRequireDetails.filepath,
          );
          const { method, path, version } = methodsAndPathsByFunctionName[importOrRequireDetails.innerFunctionName];
          allApiCalls.push({ method, path, filepath, line, withLegacyClient: false, version });
        } else {
          console.warn(`ERROR in ${localFilepath}:${line} cannot find import to ${functionName}`);
        }
      }
    } catch (e) {
      console.error(`ERROR in ${localFilepath}`);
      console.error(e);
      process.exit(1);
    }
  }

  return allApiCalls;
}

/**
 * @param {string} filepath
 * @return {{sourceCode: string, ast: any }}
 */
function getAst(filepath) {
  const sourceCode = fs.readFileSync(filepath, 'utf8');

  try {
    const ast = parser.parse(sourceCode, {
      sourceType: 'module',
    });

    return { sourceCode, ast };
  } catch (e) {
    console.error(`Cannot parse ${filepath}`);
    console.error(e);
    process.exit(1);
  }
}

/**
 * @param {string} projectDir
 * @param {Program} ast
 * @return {Record<string, { filepath: string, innerFunctionName: string, functionName: string }>}
 */
function findCleverClientImportsAndRequire(projectDir, ast) {
  /** @type {Record<string, { filepath: string, innerFunctionName: string, functionName: string }>} */
  const functionImportOrRequireByName = {};

  traverse.default(ast, {
    ImportDeclaration(path) {
      /** @type {ImportDeclaration} */
      const node = path.node;
      if (isCleverClientImport(node)) {
        for (const specifier of node.specifiers) {
          if (t.isImportNamespaceSpecifier(specifier) || t.isImportDefaultSpecifier(specifier)) {
            return;
          }
          const functionName = specifier.local.name;
          functionImportOrRequireByName[functionName] = {
            filepath: projectDir + '/node_modules/' + node.source.value,
            innerFunctionName: specifier.imported.loc.identifierName,
            functionName,
          };
        }
      }
    },

    VariableDeclaration(path) {
      /** @type {VariableDeclaration} */
      const node = path.node;
      if (isCleverClientRequire(node)) {
        if (t.isObjectPattern(node.declarations[0].id)) {
          for (const property of node.declarations[0].id.properties) {
            if (t.isObjectProperty(property) && t.isIdentifier(property.key)) {
              const propertyValue = t.isIdentifier(property.value) ? property.value.name : property.key.name;
              const functionName = propertyValue;

              if (
                t.isCallExpression(node.declarations[0].init) &&
                node.declarations[0].init.arguments.length > 0 &&
                t.isStringLiteral(node.declarations[0].init.arguments[0])
              ) {
                functionImportOrRequireByName[functionName] = {
                  filepath: projectDir + '/node_modules/' + node.declarations[0].init.arguments[0].value,
                  innerFunctionName: property.key.name,
                  functionName,
                };
              }
            }
          }
        }
      }
    },
  });

  return functionImportOrRequireByName;
}

/**
 * @param {Program} ast
 * @param {string} sourceCode
 * @return {Array<{ method: string, path: string, line: number }>}
 */
function findCleverClientLegacyCalls(ast, sourceCode) {
  /** @type {Array<{ method: string, path: string, line: number }>} */
  const apiCalls = [];

  traverse.default(ast, {
    enter(path) {
      const node = path.node;
      if (isCleverClientLegacyHttpMethodCall(node)) {
        const line = node.loc.start.line;

        const urlPath = sourceCode
          .substring(node.start, node.end)
          // remove new lines and indent
          .replaceAll(/\s+/g, '')
          // remove API.something.get()
          .replace(/^API\./, '')
          // remove foo.API from foo.API.bar.get()
          .replace(/^(.*\.)?API\./i, '')
          // remove leading () from the string
          .replace(/\(\)$/, '');

        if (!urlPath.startsWith('dateSelectionSettingManager')) {
          const parts = urlPath.split('.');
          const method = parts.pop().toUpperCase();
          const path =
            '/v2/' +
            parts
              // replace holes with `:XXX`
              .map((p) => (p === '_' ? ':XXX' : p))
              .join('/');

          apiCalls.push({ method, path, line });
        }
      }
    },
  });

  return apiCalls;
}

/**
 * @param {Program} ast
 * @return {Array<{ functionName: string, line: number }>}
 */
function findCleverClientNewCalls(ast) {
  /** @type {Array<{ functionName: string, line: number }>} */
  const functionCalls = [];

  traverse.default(ast, {
    CallExpression(path) {
      /** @type {CallExpression} */
      const node = path.node;
      if (isCleverClientNewFunctionCall(node) && t.isMemberExpression(node.callee)) {
        const line = node.loc.start.line;
        let functionName = '';

        if (t.isMemberExpression(node.callee.object) && t.isIdentifier(node.callee.object.object)) {
          functionName = node.callee.object.object.name;
        } else if (t.isCallExpression(node.callee.object) && t.isIdentifier(node.callee.object.callee)) {
          functionName = node.callee.object.callee.name;
        }

        if (functionName) {
          functionCalls.push({ functionName, line });
        }
      }
    },
  });

  return functionCalls;
}

/**
 * @param {VariableDeclaration} node
 * @return {boolean}
 */
function isCleverClientRequire(node) {
  return (
    node.declarations.length === 1 &&
    t.isCallExpression(node.declarations[0].init) &&
    t.isIdentifier(node.declarations[0].init.callee) &&
    node.declarations[0].init.callee.name === 'require' &&
    t.isStringLiteral(node.declarations[0].init.arguments[0]) &&
    node.declarations[0].init.arguments[0].value.startsWith('@clevercloud/client/esm/api/')
  );
}

/**
 * @param {ImportDeclaration} node
 * @return {boolean}
 */
function isCleverClientImport(node) {
  return t.isStringLiteral(node.source) && node.source.value.startsWith('@clevercloud/client/esm/api/');
}

const HTTP_LEGACY_CLIENT_METHODS = ['get', 'post', 'put', 'delete'];

/**
 * @param {Node} node
 * @return {boolean}
 */
function isCleverClientLegacyHttpMethodCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    HTTP_LEGACY_CLIENT_METHODS.includes(node.callee.property.name) &&
    node.arguments.length === 0
  );
}

/**
 * @param {CallExpression} node
 * @return {boolean}
 */
function isCleverClientNewFunctionCall(node) {
  return (
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.property) &&
    node.callee.property.name === 'then' &&
    node.arguments.length === 1 &&
    ((t.isIdentifier(node.arguments[0]) && node.arguments[0].name === 'sendToApi') ||
      (t.isCallExpression(node.arguments[0]) &&
        t.isIdentifier(node.arguments[0].callee) &&
        node.arguments[0].callee.name === 'sendToApi'))
  );
}

/**
 * @param {string} filepath
 * @return {Record<string, { method: string, path: string, version: string }>}
 */
function getCleverClientMethodsAndPathsByFunctionName(filepath) {
  const { ast } = getAst(filepath);

  /** @type {Record<string, { method: string, path: string, version: string }>} */
  const urlPathByFunctionName = {};

  const versionPrefix = filepath.includes('/v2/') ? '/v2' : '/v4';

  traverse.default(ast, {
    ExportNamedDeclaration(path) {
      const node = path.node;
      if (node.declaration?.type === 'FunctionDeclaration') {
        const functionName = node.declaration.id.name;
        // We can't take the first one as it could be the @typedef comment in our projects
        const commentNode = node.leadingComments?.find((commentNode) =>
          commentNode.value.split(' ').some((word) => ['GET', 'POST', 'DELETE', 'PUT'].includes(word)),
        );

        if (!commentNode) {
          return;
        }

        const commentForFunction = commentNode.value;
        const commentLines = commentForFunction.split('\n');
        if (commentLines.length > 1) {
          const methodAndPath = commentLines[1].trim().replace('* ', '').split(' ');
          if (methodAndPath.length >= 2) {
            const method = methodAndPath[0];
            const rawPath = methodAndPath[1];

            const path =
              versionPrefix +
              rawPath
                .split('/')
                .map((p) => (p.match(/^\{.*\}$/) != null ? ':XXX' : p))
                .join('/');

            urlPathByFunctionName[functionName] = { method, path, version: versionPrefix };
          }
        }
      }
    },
  });

  return urlPathByFunctionName;
}

/**
 * @param {ApiCall} a
 * @param {ApiCall} b
 * @return {number}
 */
function sortCalls(a, b) {
  if (a.path === b.path) {
    if (a.method === b.method) {
      if (a.filepath === b.filepath) {
        return a.line - b.line;
      }
      return a.filepath.localeCompare(b.filepath);
    }
    return a.method.localeCompare(b.method);
  }
  return a.path.localeCompare(b.path);
}

/**
 * @param {Array<ApiCall>} apiCalls
 * @returns {Array<Array<ApiCall>>}
 */
export function sortAndGroupByCall(apiCalls) {
  /** @type {Record<string, Array<ApiCall>>} */
  const groupsByKey = {};
  const sortedApiCalls = [...apiCalls].sort(sortCalls);
  for (const call of sortedApiCalls) {
    const key = `${call.method} ${call.path}`;
    if (groupsByKey[key] == null) {
      groupsByKey[key] = [];
    }
    groupsByKey[key].push(call);
  }
  return Object.values(groupsByKey);
}
