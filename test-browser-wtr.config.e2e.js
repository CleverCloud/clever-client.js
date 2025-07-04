import proxy from 'koa-proxies';
import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';
import { CC_API_TOKEN_GITHUB_LINKED, CC_API_TOKEN_GITHUB_UNLINKED } from './test/lib/e2e-support.js';

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  middleware: [
    getProxy('cc-api-github-unlinked', `https://api-bridge.clever-cloud.com`, CC_API_TOKEN_GITHUB_UNLINKED),
    getProxy('cc-api-github-linked', `https://api-bridge.clever-cloud.com`, CC_API_TOKEN_GITHUB_LINKED),
    getProxy('avatar', `https://www.clever-cloud.com/app/themes/Starter/assets/img/brand-assets/square-png.png`, null),
  ],
};

function getProxy(pathPrefix, target, token) {
  return proxy(`/${pathPrefix}`, {
    rewrite: (path) => path.replace(new RegExp(`^\\/${pathPrefix}\\/`, 'g'), '/'),
    target,
    headers: token == null ? null : { authorization: `Bearer ${token}` },
    changeOrigin: true,
  });
}
