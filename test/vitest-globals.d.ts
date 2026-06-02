// Typed payload handed from `test/e2e/global-setup.js` to the workers via `provide`/`inject`.
declare module 'vitest' {
  interface ProvidedContext {
    e2eUsers: Record<string, Partial<import('./lib/e2e.types.js').E2eUser>>;
  }
}

// The e2e proxy stashes a rewritten request body and the matched route on the incoming
// request before forwarding (the route carries the per-request target and auth headers).
declare module 'http' {
  interface IncomingMessage {
    newBody?: string;
    e2eRoute?: {
      prefix: string;
      target: string;
      user?: import('./lib/e2e.types.js').E2eUser;
      authorizationHeader?: () => string;
    };
  }
}

export {};
