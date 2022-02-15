'use strict';

const _ = require('lodash');
const del = require('del');
const fs = require('fs-extra');
const pathJoin = require('path').join;
const prettier = require('prettier');
const superagent = require('superagent');
// const pkg = require('../package.json');

const { CACHE_PATH, OPEN_API_URL_V2, OPEN_API_URL_V4_OVD } = require('./config.js');

async function getOpenapi (localCachePath, remoteUrl) {

  const existsInCache = await fs.pathExists(localCachePath);

  if (existsInCache) {
    console.log('Generating client from cache');
    return fs.readJson(localCachePath);
  }

  console.log(`Generating client from ${remoteUrl}`);
  const openapi = await superagent.get(remoteUrl).then(({ body }) => body);
  await fs.outputJson(localCachePath, openapi, { spaces: 2 });

  return openapi;
}

function orValue (value, valueIfEmptyString) {
  return (value == null || value === '')
    ? valueIfEmptyString
    : value;
}

async function mergeOpenapi (openapi, otherApiLocalPath) {

  const otherApi = await fs.readJson(otherApiLocalPath);

  openapi.paths = {
    ...openapi.paths,
    ...otherApi.paths,
  };

  openapi.components.schemas = {
    ...openapi.components.schemas,
    ...otherApi.components.schemas,
  };

  return openapi;
}

async function patchOpenapi (openapi, patchLocalPath) {

  const patch = await fs.readJson(patchLocalPath);

  patch.forEach(({ path, method, 'x-service': service, 'x-function': functionName, responses }) => {
    if (service != null) {
      openapi.paths[path][method]['x-service'] = service;
    }
    if (functionName != null) {
      openapi.paths[path][method]['x-function'] = functionName;
    }
    if (responses != null) {
      openapi.paths[path][method].responses = responses;
    }
  });

  return openapi;
}

function getRoutes (openapi, version) {

  return _.chain(openapi.paths)
    .entries()
    .flatMap(([rawPath, methodsAndConfig]) => {

      // Historically, the path did not contain the version as a prefix
      // If the version is in the path, we remove it
      const path = (rawPath.startsWith('/' + version + '/'))
        ? rawPath.replace(new RegExp('^/' + version + '/'), '/')
        : rawPath;

      return _.chain(methodsAndConfig)
        .entries()
        .flatMap(([method, config]) => {
          return ({ version, path, method, ...config });
        })
        .value();
    })
    .map(({ 'x-service': service, 'x-function': functionName, operationId, ...rest }) => {
      return {
        ...rest,
        service: orValue(service, 'unknown'),
        functionName: orValue(functionName, 'todo_' + operationId),
      };
    })
    .value();
}

function mergeSimilarRoutes (allRoutes) {

  const orgaToSelf = {};
  const selfToOrga = {};

  allRoutes
    .filter((r) => r.path.startsWith('/organisations/{id}'))
    .forEach((route) => {
      const selfPath = route.path.replace(/^\/organisations\/\{id\}/, '/self');
      const correspondingSelfRoute = allRoutes.find((sr) => {
        return (route.method === sr.method) && (selfPath === sr.path) && (route.functionName === sr.functionName);
      });
      if (correspondingSelfRoute) {
        orgaToSelf[route.path] = selfPath;
        selfToOrga[selfPath] = route.path;
      }
    });

  // ditch "/self" routes that have similar route for "/organisations/{id}"
  // map path: '/organisations/{id}/foo' to ['/organisations/{id}/foo', '/self/foo']
  return allRoutes
    .filter((route) => selfToOrga[route.path] == null)
    .map((route) => {
      const selfRoute = orgaToSelf[route.path];
      if (selfRoute != null) {
        return { ...route, path: [route.path, selfRoute] };
      }
      return route;
    });
}

function getAcceptHeader (responses) {
  const res = responses['200'] || responses.default;
  if (res == null || res.content == null) {
    return {};
  }
  const acceptValues = Object.keys(res.content);
  return { Accept: acceptValues.join(', ') };
}

function getContentTypeHeader (requestBody) {
  if (requestBody != null) {
    const bodyContentTypes = Object.keys(requestBody.content);
    if (bodyContentTypes.length > 1) {
      // TODO
      console.warn('route has many content types');
    }
    return { 'Content-Type': bodyContentTypes[0] };
  }
  return {};
}

function getQueryParams (parameters) {

  const queryParams = parameters
    .filter((param) => param.in === 'query')
    .map(({ name }) => `'${name}'`);

  return (queryParams.length > 0)
    ? `queryParams: pickNonNull(params, [${queryParams.join(', ')}]),`
    : '// no query params';
}

function buildClientCode (route) {

  const { method, version, path, parameters = [], responses, requestBody, functionName } = route;

  const isMultipath = Array.isArray(path);

  const urlComments = (isMultipath ? path : [path])
    .map((p) => `* ${method.toLocaleUpperCase()} ${p}`);
  const paramsJsDoc = parameters.map(({ name }) => `* @param {String} params.${name}`);
  const bodyJsDoc = (requestBody != null) ? '* @param {Object} body' : null;

  const comments = [
    '/**',
    ...urlComments,
    '* @param {Object} params',
    ...paramsJsDoc,
    bodyJsDoc,
    '*/',
  ].filter((a) => a != null).join('\n');

  const multipathIf = isMultipath
    ? 'const urlBase = (params.id == null) ? \'/self\' : `/organisations/${params.id}`'
    : '// no multipath for /self or /organisations/{id}';

  const functionArgs = (requestBody != null)
    ? 'params, body'
    : parameters.length > 0
      ? 'params'
      : '';

  const rawPath = isMultipath
    ? '/' + version + '${urlBase}' + path[0].replace('/organisations/{id}', '').replace(/\{(.*?)\}/g, '${params.$1}')
    : '/' + version + path.replace(/\{(.*?)\}/g, '${params.$1}');

  if (responses == null) {
    console.log(rawPath);
  }

  const headers = JSON.stringify({
    ...getAcceptHeader(responses),
    ...getContentTypeHeader(requestBody),
    // We're waiting for improved CORS support on this
    // 'cc-client-version': pkg.version,
  });

  const queryParams = getQueryParams(parameters);

  const body = (requestBody != null)
    ? 'body,'
    : '// no body';

  const code = `
    ${comments}
    export function ${functionName} (${functionArgs}) {
      ${multipathIf}
      return Promise.resolve({
        method: '${method}',
        url: \`${rawPath}\`,
        headers: ${headers},
        ${queryParams}
        ${body}
      });
    }
  `.trim();

  return { ...route, code };
}

function mergeCodesByService (allRoutesWithCode) {

  return _.chain(allRoutesWithCode)
    .groupBy((r) => r.service)
    .mapValues((allRoutesForService) => {
      return _.chain(allRoutesForService)
        .sortBy(['path', 'method'])
        .map((r) => r.code)
        .value()
        .join('\n\n');
    })
    .toPairs()
    .sortBy(([key]) => key)
    .fromPairs()
    .value();
}

function formatCode (rawContents) {
  // format (also parse and check what is generated)
  return prettier.format(rawContents, {
    parser: 'babel',
    printWidth: 200,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
  });
}

function buildLecagyClientSnippet (obj) {
  return _.flatMap(obj, (value, key) => {
    const safeKey = JSON.stringify(key);
    return (typeof value === 'string')
      ? `${safeKey}: ${value},`
      : [`${safeKey}: {`, ...buildLecagyClientSnippet(value), '},'];
  });
}

// sort keys so we can easily diff client
// HTTP methods first, then _, then the rest
function sortLegacyClientObject (object) {
  return _.chain(object)
    .toPairs()
    .sortBy(([key]) => {
      return ['get', 'put', 'post', 'delete'].includes(key)
        ? `$${key}`
        : key;
    })
    .fromPairs()
    .mapValues((value) => {
      return (typeof value === 'object' && !Array.isArray(value))
        ? sortLegacyClientObject(value)
        : value;
    })
    .value();
}

function buildLegacyClientCode (allRoutes, codeByService) {

  // generate legacy client
  const legacyClient = {};
  allRoutes.forEach(({ path, method, service, functionName }) => {

    const rawSegments = (path + '/' + method)
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .split('/');

    const objectSegments = rawSegments
      .map((s) => s.replace(/\{.+?\}/g, '_'));

    const pathParams = rawSegments
      .flatMap((a) => a.match(/\{.+?\}/g))
      .filter((a) => a != null)
      .map((a) => a.replace(/\{(.+?)\}/g, '$1'));

    const value = (pathParams.length > 0)
      ? `prepareRequest(${service}.${functionName}, ${JSON.stringify(pathParams)})`
      : `prepareRequest(${service}.${functionName})`;

    _.set(legacyClient, objectSegments, value);
  });

  const sortedLegacyClient = sortLegacyClientObject(legacyClient);

  const legacyClientCode = [];

  for (const service in codeByService) {
    legacyClientCode.push(`import * as ${service} from './${_.kebabCase(service)}.js'`);
  }
  legacyClientCode.push('');

  legacyClientCode.push('export function initLegacyClient(prepareRequest) {');
  legacyClientCode.push('const client = {');
  legacyClientCode.push(...buildLecagyClientSnippet(sortedLegacyClient));
  legacyClientCode.push('};');
  legacyClientCode.push('return client;');
  legacyClientCode.push('};');

  return legacyClientCode.join('\n');
}

/**
 * Takes OpenAPI JSON document from remote (or from cache)
 * Use patch to add "x-service" and "x-function" (temporary :p)
 * Generates API client
 * - grouped by service
 * - merged by "/self" and "/organization/{id}"
 * - tree-shakable
 * Generates legacy API client
 * - simple wrapper around new modules with legacy object API (by path)
 */
async function generateClient () {

  // fetch and load OpenAPI JSON document
  const apiLocalCachePathV2 = pathJoin(CACHE_PATH, 'openapi-clever-v2.json');
  const openapi = await getOpenapi(apiLocalCachePathV2, OPEN_API_URL_V2);

  // merge with hand defined APIs (temporary lol)
  // TODO: generate those from projects
  const otherApiLocalPathV2 = './data/other-apis-v2.json';
  const mergedApiV2 = await mergeOpenapi(openapi, otherApiLocalPathV2);

  // patch OpenAPI with custom properties
  // TODO: directly add those properties in the source code (Java & Scala APIs)
  const patchLocalPathV2 = './data/patch-for-openapi-clever-v2.json';
  const patchedApiV2 = await patchOpenapi(mergedApiV2, patchLocalPathV2);
  const patchedApiLocalCachePathV2 = pathJoin(CACHE_PATH, 'openapi-clever-v2.patched.json');
  await fs.outputJson(patchedApiLocalCachePathV2, patchedApiV2, { spaces: 2 });

  // Read OpenAPI v4 from local (waiting for a published one)
  const openapiV4 = await fs.readJson('./data/openapi-clever-v4.json');

  // Read OpenAPI v4 from remote OVD
  const apiLocalCachePathV4Ovd = pathJoin(CACHE_PATH, 'openapi-clever-v4-ovd.json');
  const openapiV4Ovd = await getOpenapi(apiLocalCachePathV4Ovd, OPEN_API_URL_V4_OVD);

  // extract all routes
  const routesV2 = getRoutes(patchedApiV2, 'v2');
  const allRoutes = [
    ...routesV2,
    ...getRoutes(openapiV4, 'v4'),
    ...getRoutes(openapiV4Ovd, 'v4'),
  ];

  // group "/self" with "/organisations/{id}"
  const mergedRoutes = mergeSimilarRoutes(allRoutes);
  const routesByVersion = _.groupBy(mergedRoutes, 'version');

  // clear generated client dir
  const generatedClientBasePath = './esm/api';
  await del(pathJoin(generatedClientBasePath, '**', '*'));

  for (const [version, routes] of Object.entries(routesByVersion)) {

    const generatedClientPath = pathJoin(generatedClientBasePath, version);
    await fs.ensureDir(generatedClientPath);

    // generate code for all routes
    const allRoutesWithCode = routes.map((route) => buildClientCode(route));

    // group and merge all codes by service
    const codeByService = mergeCodesByService(allRoutesWithCode);

    // write code in appropriate dir/files
    for (const service in codeByService) {
      const filepath = pathJoin(generatedClientPath, `${_.kebabCase(service)}.js`);
      const rawContents = codeByService[service];
      const rawContentsWithImports = `import { pickNonNull } from '../../pick-non-null.js';
    
    ${rawContents}`;
      const contents = formatCode(rawContentsWithImports);
      await fs.appendFile(filepath, contents, 'utf8');
    }

    if (version === 'v2') {
      // generate and write code for legacy client
      const legacyClientCode = buildLegacyClientCode(routesV2, codeByService);
      const legacyClientFilepath = pathJoin(generatedClientPath, 'legacy-client.js');
      const legacyClientFormattedCode = formatCode(legacyClientCode);
      await fs.appendFile(legacyClientFilepath, legacyClientFormattedCode, 'utf8');
    }
  }
}

generateClient()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
