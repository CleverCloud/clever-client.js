import proxy from 'koa-proxies';
import { TOTP } from 'totp-generator';
import { CcAuthApiToken } from './src/lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from './src/lib/auth/cc-auth-oauth-v1-plaintext.js';
import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';
import { getAllE2eUsers, getE2eUser } from './test/lib/e2e-test-users.js';

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  middleware: [
    async (ctx, next) => {
      // only for api-tokens creation, we want to rewrite the request body to include the right password and mfaCode.
      const match = ctx.request.url.match(/\/cc-api-bridge-(.+)-none\/api-tokens/);
      if (match != null) {
        const userId = match[1];
        const user = getE2eUser(userId);
        const rawBody = await getRawBody(ctx.req);
        const body = JSON.parse(rawBody);

        body.email = user.email;
        body.password = user.password;
        body.mfaCode = TOTP.generate(user.totpSecret).otp;

        // we set the `newBody` custom prop on request so that we can use it in proxy
        ctx.req.newBody = JSON.stringify(body);
      }
      await next();
    },
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
        getProxy(
          `cc-api-bridge-${user.userName}-oauth-v1`,
          `https://api-bridge.clever-cloud.com`,
          new CcAuthOauthV1Plaintext(user.oauthTokens).getToken(),
        ),
        getProxy(`cc-api-bridge-${user.userName}-none`, `https://api-bridge.clever-cloud.com`, null),
      ];
    }),
    getProxy('avatar', `https://www.clever-cloud.com/app/themes/Starter/assets/img/brand-assets/square-png.png`, null),
    getProxy(`redis-http`, `https://kv-proxy.services.clever-cloud.com`, null),
  ],
};

/**
 * @param {string} pathPrefix
 * @param {string} target
 * @param {string|null} token
 * @return {Application.Middleware}
 */
function getProxy(pathPrefix, target, token) {
  return proxy(`/${pathPrefix}`, {
    rewrite: (path) => path.replace(new RegExp(`^\\/${pathPrefix}\\/`, 'g'), '/'),
    target,
    headers: token == null ? null : { authorization: token },
    changeOrigin: true,
    events: {
      proxyReq: (proxyReq, req) => {
        // use the `newBody` custom prop that may have been calculated in previous middleware
        if (req.newBody != null) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(req.newBody));
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.write(req.newBody);
          proxyReq.end();
        }
      },
    },
  });
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}
