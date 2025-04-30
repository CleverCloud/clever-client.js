import proxy from 'koa-proxies';
import { CcAuthApiToken } from './src/lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from './src/lib/auth/cc-auth-oauth-v1-plaintext.js';
import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';
import { getAllE2eUsers } from './test/lib/e2e-test-users.js';

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  middleware: [
    ...getAllE2eUsers().flatMap((user) => {
      return [
        getProxy(
          `cc-api-${user.userName}-api-token`,
          `https://api-bridge.clever-cloud.com`,
          new CcAuthApiToken(user.apiToken).getToken(),
        ),
        getProxy(
          `cc-api-${user.userName}-oauth-v1`,
          `https://api.clever-cloud.com`,
          new CcAuthOauthV1Plaintext(user.oauthTokens).getToken(),
        ),
      ];
    }),
    getProxy('avatar', `https://www.clever-cloud.com/app/themes/Starter/assets/img/brand-assets/square-png.png`, null),
  ],
};

function getProxy(pathPrefix, target, token) {
  return proxy(`/${pathPrefix}`, {
    rewrite: (path) => path.replace(new RegExp(`^\\/${pathPrefix}\\/`, 'g'), '/'),
    target,
    headers: token == null ? null : { authorization: token },
    changeOrigin: true,
  });
}
