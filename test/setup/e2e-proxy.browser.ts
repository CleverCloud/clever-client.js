import httpProxy from 'http-proxy-3';
import type { ClientRequest, IncomingMessage, ServerResponse } from 'node:http';
import { TOTP } from 'totp-generator';
import type { Plugin } from 'vite';
import { CcAuthApiToken } from '../../src/lib/auth/cc-auth-api-token.js';
import { CcAuthOauthV1Plaintext } from '../../src/lib/auth/cc-auth-oauth-v1-plaintext.js';
import { encodeToBase64 } from '../../src/lib/utils.js';
import { getAllE2eUsers, getE2eUser } from '../lib/e2e-test-users.js';
import type { E2eUser, E2eUserName } from '../lib/e2e.types.js';
import { login, logout } from '../lib/login.js';

/**
 * One proxy route: a URL prefix forwarded to a target host, optionally carrying a user's
 * auth headers. Matches the `e2eRoute` shape augmented onto `http.IncomingMessage`.
 */
interface E2eRoute {
  prefix: string;
  target: string;
  user?: E2eUser;
  authorizationHeader?: () => string;
}

/**
 * Vite plugin powering Vitest browser-mode e2e tests.
 *
 * Vitest browser mode runs two Vite servers and applies this plugin to both; we set things
 * up only on the browser server (the one with an `httpServer` that actually serves the
 * browser and receives the proxied requests). On that server's boot it:
 * 1. logs in all e2e users (the same shared `E2eUser` objects the proxy routes read),
 * 2. mounts one middleware per route (user × auth combination, plus avatar and redis-http)
 *    that forwards browser requests through a single shared proxy to the real Clever Cloud
 *    hosts, injecting the route's `Authorization` / `x-clever-password` headers,
 * 3. rewrites the body of a couple of sensitive endpoints (change password, create token).
 *
 * On dev-server shutdown it closes the proxy and logs the users out (deleting the temporary
 * tokens). Logout is kept here (not in a separate globalSetup) because it relies on the
 * in-process post-login token state held on the shared user objects.
 *
 * Connect's `server.middlewares.use('/prefix', ...)` strips the prefix from `req.url`, so
 * each route's path is forwarded to its target host as-is.
 */
export function e2eProxyPlugin(): Plugin {
  // Log users out (deleting the temporary tokens) at most once, even if both the
  // httpServer `close` event and the `buildEnd` fallback fire.
  let loggedOut = false;
  const logoutOnce = async () => {
    if (loggedOut) {
      return;
    }
    loggedOut = true;
    await logout();
  };

  return {
    name: 'e2e-proxy',
    async configureServer(server) {
      // Vitest browser mode runs TWO Vite servers and applies project plugins to both: the
      // parent test-runner server (`middlewareMode`, no `httpServer`) and the browser server
      // (real `httpServer`) that actually serves the browser and receives our proxied
      // requests. Only set things up on the browser server; setting up on the parent would
      // log everyone in a second time (creating duplicate tokens, wasting the API rate-limit
      // budget) and mount proxies on a server nothing hits.
      if (server.httpServer == null) {
        return;
      }

      await login();

      // Body-rewrite middleware: must run before the proxy middlewares. It only consumes
      // the request stream for matching paths, then stashes the rewritten body on
      // `req.newBody` so the proxy can replay it.
      const rewriters = [rewriteCcApiChangePassword, rewriteCcApiBridgeCreateToken];
      server.middlewares.use((req: IncomingMessage, _res: ServerResponse, next: () => void) => {
        void (async () => {
          try {
            for (const rewriter of rewriters) {
              if (rewriter.match(req.url)) {
                const rawBody = await getRawBody(req);
                const newBody = await rewriter.newBody(JSON.parse(rawBody) as Record<string, unknown>, req.url);
                req.newBody = JSON.stringify(newBody);
                break;
              }
            }
          } catch {
            // ignore: let the proxy forward the request as-is
          }
          next();
        })();
      });

      // A single shared proxy for every route: the per-request `target` (and the
      // route-specific auth headers, read from `req.e2eRoute`) are resolved in the
      // `proxyReq` handler / at `proxy.web` call time, so we don't spin up one proxy (and
      // one socket pool) per route.
      const proxy = httpProxy.createProxyServer({ changeOrigin: true });
      proxy.on('error', () => {});
      proxy.on('proxyReq', (proxyReq: ClientRequest, req: IncomingMessage) => {
        const route = req.e2eRoute;
        if (route == null) {
          return;
        }
        // handle x-clever-password header (used in cc-api mfa endpoints)
        if (req.headers['x-clever-password'] != null && route.user != null) {
          proxyReq.setHeader('x-clever-password', encodeToBase64(route.user.password));
        }
        if (route.authorizationHeader != null) {
          proxyReq.setHeader('Authorization', route.authorizationHeader());
        }
        // use the `newBody` custom prop that may have been calculated by the body-rewrite middleware
        if (req.newBody != null) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(req.newBody));
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.write(req.newBody);
          proxyReq.end();
        }
      });

      for (const route of buildRoutes()) {
        server.middlewares.use(`/${route.prefix}`, (req: IncomingMessage, res: ServerResponse) => {
          req.e2eRoute = route;
          proxy.web(req, res, { target: route.target });
        });
      }

      // Log users out and close the proxy when the dev server shuts down. A function
      // *returned* from `configureServer` is Vite's "post" hook — it runs at startup, right
      // after internal middlewares are installed, NOT at teardown. Returning `() => logout()`
      // therefore logged everyone out before any test ran. Hook the httpServer `close` event
      // instead, with `buildEnd` as a fallback (same pattern as the doublure mock-server
      // plugin). Closing the proxy releases its open sockets, which otherwise keep the
      // process alive after the tests finish.
      server.httpServer.once('close', () => {
        proxy.close();
        void logoutOnce();
      });
    },
    async buildEnd() {
      await logoutOnce();
    },
  };
}

/**
 * Builds the list of proxy routes (one set per user × auth, plus avatar and redis-http).
 */
function buildRoutes(): Array<E2eRoute> {
  return [
    ...getAllE2eUsers().flatMap((user) => [
      {
        prefix: `cc-api-${user.userName}-api-token`,
        target: `https://api-bridge.clever-cloud.com`,
        user,
        authorizationHeader: () => new CcAuthApiToken(user.apiToken).getAuthorization(),
      },
      {
        prefix: `cc-api-${user.userName}-oauth-v1`,
        target: `https://api.clever-cloud.com`,
        user,
        authorizationHeader: () => new CcAuthOauthV1Plaintext(user.oauthTokens).getAuthorization(),
      },
      {
        prefix: `cc-api-bridge-${user.userName}-oauth-v1`,
        target: `https://api-bridge.clever-cloud.com`,
        user,
        authorizationHeader: () => new CcAuthOauthV1Plaintext(user.oauthTokens).getAuthorization(),
      },
      {
        prefix: `cc-api-bridge-${user.userName}-none`,
        target: `https://api-bridge.clever-cloud.com`,
        user,
      },
    ]),
    {
      prefix: 'avatar',
      target: `https://www.clever.cloud/app/themes/Starter/assets/img/brand-assets/square-png.png`,
    },
    {
      prefix: 'redis-http',
      target: `https://kv-proxy.services.clever-cloud.com`,
    },
  ];
}

const rewriteCcApiChangePassword = {
  match(url: string) {
    return url.match(/\/cc-api-(.+)-oauth-v1\/v2\/self\/change_password/) != null;
  },
  newBody(body: Record<string, unknown>, url: string) {
    const match = url.match(/\/cc-api-(.+)-oauth-v1\/v2\/self\/change_password/);
    const user = getE2eUser(match[1] as E2eUserName);
    if (body.newPassword === user.newTemporaryPassword) {
      body.oldPassword = user.password;
    }
    if (body.oldPassword === user.newTemporaryPassword) {
      body.newPassword = user.password;
    }
    return body;
  },
};

const rewriteCcApiBridgeCreateToken = {
  match(url: string) {
    return url.match(/\/cc-api-bridge-(.+)-none\/api-tokens/) != null;
  },
  async newBody(body: Record<string, unknown>, url: string) {
    const match = url.match(/\/cc-api-bridge-(.+)-none\/api-tokens/);
    const user = getE2eUser(match[1] as E2eUserName);
    body.email = user.email;
    body.password = user.password;
    if (user.totpSecret != null) {
      body.mfaCode = (await TOTP.generate(user.totpSecret)).otp;
    }
    return body;
  },
};

function getRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}
