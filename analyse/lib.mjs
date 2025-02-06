import fs from 'fs';
import * as acorn from 'acorn';
import { walk } from 'estree-walker';

/**
 * @typedef {import('acorn').Program} AcornProgram
 * @typedef {import('acorn').Node} AcornNode
 */

/**
 * @typedef {Object} Comment
 * @property {string} text
 * @property {number} startLine
 * @property {number} endLine
 */

/**
 * @typedef {object} ApiCall
 * @property {string} method
 * @property {string} path
 * @property {string} filepath
 * @property {number} line
 */

/**
 * @param {string} projectDir
 * @param {Array<string>} sourceFilepaths
 * @return {Array<ApiCall>}
 */
export function getApiCalls (projectDir, sourceFilepaths) {

  /** @type {Array<ApiCall>} */
  const allApiCalls = [];

  for (const localFilepath of sourceFilepaths) {
    const filepath = `${projectDir}/${localFilepath}`;
    try {
      const { sourceCode, ast } = getAstAndComments(localFilepath);

      const legacyCalls = findCleverClientLegacyCalls(ast, sourceCode);
      for (const { method, path, line } of legacyCalls) {
        allApiCalls.push({ method, path, filepath, line });
      }

      const importsAndRequireByFunctionName = findCleverClientImportsAndRequire(ast);

      const newCalls = findCleverClientNewCalls(ast, sourceCode);
      for (const { functionName, line } of newCalls) {
        const importOrRequireDetails = importsAndRequireByFunctionName[functionName];
        if (importOrRequireDetails != null) {
          const methodsAndPathsByFunctionName = getCleverClientMethodsAndPathsByFunctionName(importOrRequireDetails.filepath);
          const { method, path } = methodsAndPathsByFunctionName[importOrRequireDetails.innerFunctionName];
          allApiCalls.push({ method, path, filepath, line });
        }
        else {
          console.warn(`ERROR in ${localFilepath}:${line} cannot find import to ${functionName}`);
          // process.exit(1);
        }
      }

    }
    catch (e) {
      console.error(`ERROR in ${localFilepath}`);
      console.error(e);
      process.exit(1);
    }
  }

  return allApiCalls;
}

/**
 * @param {string} filepath
 * @return {Promise<{ sourceCode:string, ast: AcornProgram, comment: Array<Comment> }>}
 */
function getAstAndComments (filepath) {
  const sourceCode = fs.readFileSync(filepath, 'utf8');

  /** @type {Array<Comment>} */
  const comments = [];

  try {
    const ast = acorn.parse(sourceCode, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      locations: true,
      onComment (isBlock, text, start, end, startLoc, endLoc) {
        comments.push({ text, startLine: startLoc.line, endLine: endLoc.line });
      },
    });

    return { sourceCode, ast, comments };
  }
  catch (e) {
    console.error(`Cannot parse ${filepath}`);
    console.error(e);
    process.exit(1);
  }
}

/**
 * @param {AcornProgram} ast
 * @return {Record<string, { filepath: string, innerFunctionName: string, functionName: string }>}
 */
function findCleverClientImportsAndRequire (ast) {

  /** @type {Record<string, { filepath: string, innerFunctionName: string, functionName: string }>} */
  const functionImportOrRequireByName = {};

  walk(ast, {
    enter (node, parent, prop, index) {
      if (isCleverClientRequire(node)) {
        if (node.declarations[0].id.type !== 'Identifier') {
          for (const property of node.declarations[0].id.properties) {
            const functionName = property.value.name;
            functionImportOrRequireByName[functionName] = {
              filepath: 'node_modules/' + node.declarations[0].init.arguments[0].value,
              innerFunctionName: property.key.name,
              functionName,
            };
          }
        }
      }
      else if (isCleverClientImport(node)) {
        for (const specifier of node.specifiers) {
          const functionName = specifier.local.name;
          functionImportOrRequireByName[functionName] = {
            filepath: 'node_modules/' + node.source.value,
            innerFunctionName: specifier.imported.name,
            functionName,
          };
        }
      }
    },
  });

  return functionImportOrRequireByName;
}

/**
 * @param {AcornProgram} ast
 * @param {string} sourceCode
 * @return {Array<{ method: string, path: string, line: number }>}
 */
function findCleverClientLegacyCalls (ast, sourceCode) {

  /** @type {Array<{ method: string, path: string, line: number }>} */
  const apiCalls = [];

  walk(ast, {
    enter (node, parent, prop, index) {
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
          const path = '/v2/' + parts
            // replace holes with `:XXX`
            .map((p) => p === '_' ? ':XXX' : p)
            .join('/');

          apiCalls.push({ method, path, line });
        }
      }
    },
  });

  return apiCalls;
}

/**
 * @param {AcornProgram} ast
 * @return {Array<{ functionName: string, line: number }>}
 */
function findCleverClientNewCalls (ast) {

  /** @type {Array<{ functionName: string, line: number }>} */
  const functionCalls = [];

  walk(ast, {
    enter (node, parent, prop, index) {
      if (isCleverClientNewFunctionCall(node)) {
        const line = node.loc.start.line;
        const functionName = node.callee.object.name ?? node.callee.object.callee.name;
        functionCalls.push({ functionName, line });
      }
    },
  });

  return functionCalls;
}

/**
 * @param {AcornNode} node
 * @return {boolean}
 */
function isCleverClientRequire (node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations.length === 1 &&
    node.declarations[0].init?.type === 'CallExpression' &&
    node.declarations[0].init.callee.type === 'Identifier' &&
    node.declarations[0].init.callee.name === 'require' &&
    node.declarations[0].init.arguments[0].type === 'Literal' &&
    (node.declarations[0].init.arguments[0].value.startsWith('@clevercloud/client/esm/api/') ||
      node.declarations[0].init.arguments[0].value.startsWith('@clevercloud/client/cjs/api/'));
}

/**
 * @param {AcornNode} node
 * @return {boolean}
 */
function isCleverClientImport (node) {
  return node.type === 'ImportDeclaration' &&
    node.source.type === 'Literal' &&
    (node.source.value.startsWith('@clevercloud/client/esm/api/') ||
      node.source.value.startsWith('@clevercloud/client/cjs/api/'));
}

const HTTP_LEGACY_CLIENT_METHODS = ['get', 'post', 'put', 'delete'];

/**
 * @param {AcornNode} node
 * @return {boolean}
 */
function isCleverClientLegacyHttpMethodCall (node) {
  return node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    HTTP_LEGACY_CLIENT_METHODS.includes(node.callee.property.name) &&
    node.arguments.length === 0;
}

/**
 * @param {AcornNode} node
 * @return {boolean}
 */
function isCleverClientNewFunctionCall (node) {
  return node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'then' &&
    node.arguments.length === 1 &&
    (
      (node.arguments[0].type === 'Identifier' &&
        node.arguments[0].name === 'sendToApi')
      || (node.arguments[0].type === 'CallExpression' &&
        node.arguments[0].callee.type === 'Identifier' &&
        node.arguments[0].callee.name === 'sendToApi')
    );
}

/**
 * @param {string} filepath
 * @return {Record<string, { method: string, path: string }>}
 */
function getCleverClientMethodsAndPathsByFunctionName (filepath) {

  const { ast, comments } = getAstAndComments(filepath);

  const urlPathByFunctionName = {};

  const versionPrefix = filepath.includes('/v2/') ? '/v2' : '/v4';

  walk(ast, {
    enter (node, parent, prop, index) {
      if (node.type === 'ExportNamedDeclaration' && node.declaration.type === 'FunctionDeclaration') {
        const functionName = node.declaration.id.name;
        const commentForFunction = comments.find(({ endLine }) => endLine === node.declaration.id.loc.end.line - 1);
        const [method, rawPath] = commentForFunction.text
          .split('\n')[1]
          .trim()
          .replace('* ', '')
          .split(' ');
        const path = versionPrefix + rawPath
          .split('/')
          .map((p) => p.match(/^\{.*\}$/) != null ? ':XXX' : p)
          .join('/');
        urlPathByFunctionName[functionName] = { method, path };
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
function sortCalls (a, b) {
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

export function sortAndGroupByCall (apiCalls) {
  const groupsByKey = {};
  const sortedApiCalls = apiCalls.toSorted(sortCalls);
  for (const call of sortedApiCalls) {
    const key = `${call.method} ${call.path}`;
    if (groupsByKey[key] == null) {
      groupsByKey[key] = [];
    }
    groupsByKey[key].push(call);
  }
  return Object.values(groupsByKey);
}

export function streamToString (stream) {
  return new Promise((resolve) => {
    let input = '';
    process.stdin.on('data', (chunk) => input += chunk);
    process.stdin.on('end', () => resolve(input));
  });
}
