import proxy from 'koa-proxies';
import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';
import { DEFAULT_USER_TOKEN, GITHUB_USER_TOKENS } from './test/lib/cc-api-client.js';

const DEFAULT_AUTH_HEADER = getBearerToken(DEFAULT_USER_TOKEN);
const GITHUB_AUTH_HEADER = getOAuthHeader(GITHUB_USER_TOKENS);

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  middleware: [
    proxy('/cc-api-none', {
      rewrite: (path) => path.replace(/^\/cc-api-none\//g, '/'),
      target: `https://api.clever-cloud.com`,
      changeOrigin: true,
    }),
    proxy('/cc-api-default', {
      rewrite: (path) => path.replace(/^\/cc-api-default\//g, '/'),
      target: `https://api-bridge.clever-cloud.com`,
      headers: { Authorization: DEFAULT_AUTH_HEADER },
      changeOrigin: true,
    }),
    proxy('/cc-api-github', {
      rewrite: (path) => path.replace(/^\/cc-api-github\//g, '/'),
      target: `https://api.clever-cloud.com`,
      headers: { Authorization: GITHUB_AUTH_HEADER },
      changeOrigin: true,
    }),
  ],
};

function getBearerToken(token) {
  return `Bearer ${token}`;
}

function getOAuthHeader(oAuthTokens) {
  const tokens = [
    `oauth_consumer_key="${oAuthTokens.consumerKey}"`,
    `oauth_token="${oAuthTokens.token}"`,
    `oauth_signature="${oAuthTokens.consumerSecret}%26${oAuthTokens.secret}"`,
  ];
  return `OAuth ${tokens.join(', ')}`;
}
