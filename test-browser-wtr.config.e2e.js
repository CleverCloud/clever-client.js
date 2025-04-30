import proxy from 'koa-proxies';
import { CcAuthApiToken } from './src/lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from './src/lib/auth/cc-auth-oauth-v1-plaintext.js';
import { encodeToBase64 } from './src/lib/utils.js';
import { defaultConfig } from './test/conf/test-browser-wtr.config.default.js';
import { getAllE2eUsers, getE2eUser } from './test/lib/e2e-test-users.js';

export default {
  ...defaultConfig(['test/e2e/**/*.spec.js']),
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 10000,
      slow: 2000,
    },
  },
  testsFinishTimeout: 1000 * 60 * 10,
  middleware: [
    async (ctx, next) => {
      const rewrite = [rewriteCcApiChangePassword];
      for (const r of rewrite) {
        if (r.match(ctx.request.url)) {
          const rawBody = await getRawBody(ctx.req);
          const newBody = r.newBody(JSON.parse(rawBody), ctx.request.url);
          // we set the `newBody` custom prop on request so that we can use it in proxy
          ctx.req.newBody = JSON.stringify(newBody);
          break;
        }
      }
      await next();
    },
    ...getAllE2eUsers().flatMap((user) => {
      return [
        getProxy(
          `cc-api-${user.userName}-api-token`,
          `https://api-bridge.clever-cloud.com`,
          user,
          new CcAuthApiToken(user.apiToken).getAuthorization(),
        ),
        getProxy(
          `cc-api-${user.userName}-oauth-v1`,
          `https://api.clever-cloud.com`,
          user,
          new CcAuthOauthV1Plaintext(user.oauthTokens).getAuthorization(),
        ),
      ];
    }),
    getProxy('avatar', `https://www.clever-cloud.com/app/themes/Starter/assets/img/brand-assets/square-png.png`),
  ],
};

/**
 * @param {string} pathPrefix
 * @param {string} target
 * @param {string|null} [token]
 * @param {E2eUser|null} [user]
 */
function getProxy(pathPrefix, target, user, token) {
  return proxy(`/${pathPrefix}`, {
    rewrite: (path) => path.replace(new RegExp(`^\\/${pathPrefix}\\/`, 'g'), '/'),
    target,
    headers: token == null ? null : { authorization: token },
    changeOrigin: true,
    events: {
      proxyReq: (proxyReq, req) => {
        // handle x-clever-password header (used in cc-api mfa endpoints)
        if (req.headers['x-clever-password'] != null) {
          proxyReq.setHeader('x-clever-password', encodeToBase64(user.password));
        }

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

const rewriteCcApiChangePassword = {
  match(url) {
    return url.match(/\/cc-api-(.+)-oauth-v1\/v2\/self\/change_password/) != null;
  },
  newBody(body, url) {
    const match = url.match(/\/cc-api-(.+)-oauth-v1\/v2\/self\/change_password/);
    const userId = match[1];
    const user = getE2eUser(userId);
    if (body.newPassword === user.newTemporaryPassword) {
      body.oldPassword = user.password;
    }
    if (body.oldPassword === user.newTemporaryPassword) {
      body.newPassword = user.password;
    }
    return body;
  },
};
