import path from 'node:path';

/**
 * @typedef {import('./endpoint.types.js').EndpointsSource} EndpointsSource
 */

export const WORKING_DIR = './data/endpoints';
export const SRC_DIR = './src';
export const CACHE_DIR = './.cache';

/** @type {Array<EndpointsSource>} */
export const SOURCES = [
  {
    type: 'file',
    id: 'local-cc-api-v4',
    path: path.join(WORKING_DIR, './input/local-cc-api-v4.json'),
    target: 'api',
    pathPrefix: '/v4',
  },
  {
    type: 'url',
    id: 'remote-cc-api-ovd',
    url: 'https://api.clever-cloud.com/v4/ovd/openapi.json',
    target: 'api',
    pathPrefix: '',
  },
  {
    type: 'file',
    id: 'local-cc-api-v2',
    path: path.join(WORKING_DIR, './input/local-cc-api-v2.json'),
    target: 'api',
    pathPrefix: '/v2',
  },
  {
    type: 'url',
    id: 'remote-cc-api-v2',
    url: 'https://api.clever-cloud.com/v2/openapi.json',
    target: 'api',
    pathPrefix: '/v2',
  },
  {
    type: 'url',
    id: 'remote-auth-backend',
    url: 'https://api-bridge.clever-cloud.com/documentation/json',
    target: 'auth-backend',
    pathPrefix: '',
  },
  {
    type: 'url',
    id: 'remote-redis-http',
    url: 'https://kv-proxy.services.clever-cloud.com/documentation/json',
    target: 'redis-http',
    pathPrefix: '',
  },
];
