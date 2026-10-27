import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CcApiClient } from '../../../../../../src/clients/cc-api/cc-api-client.js';
import { CreateAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/create-auth-mfa-command.js';
import { DeleteAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/delete-auth-mfa-command.js';
import { MemoryStore } from '../../../../../../src/clients/cc-api/lib/store/memory-store.js';
import type { ResourceIdIndex } from '../../../../../../src/clients/cc-api/types/resource-id-resolver.types.js';
import type { CcHttpError } from '../../../../../../src/lib/error/cc-client-errors.js';
import type { Command } from '../../../../../../src/types/command.types.js';
import { expectPromiseThrows } from '../../../../../lib/expect-utils.js';

const AUTH = { kind: 'TOTP', password: 'password' } as const;

/** An error answered by cc-api, with the id its `Errors` enum gives it. */
function apiError(status: number, id: number, extra: object = {}) {
  return { status, body: { id, message: 'error', type: 'error', ...extra } };
}

const CASES: Array<{
  name: string;
  command: () => Command<'cc-api', unknown, unknown>;
  request: { method: string; path: string };
  response: { status: number; body: unknown };
  code: string;
}> = [
  {
    name: 'CreateAuthMfaCommand: wrong password',
    command: () => new CreateAuthMfaCommand(AUTH),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP' },
    response: apiError(401, 3029),
    code: 'clever.auth.invalid-password',
  },
  {
    name: 'CreateAuthMfaCommand: email address not validated',
    command: () => new CreateAuthMfaCommand(AUTH),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP' },
    response: apiError(400, 8502),
    code: 'clever.auth.email-not-validated',
  },
  {
    name: 'CreateAuthMfaCommand: factor already active',
    command: () => new CreateAuthMfaCommand(AUTH),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP' },
    response: apiError(409, 3102),
    code: 'clever.auth.mfa-already-enabled',
  },
  {
    name: 'DeleteAuthMfaCommand: factor not active',
    command: () => new DeleteAuthMfaCommand(AUTH),
    request: { method: 'DELETE', path: '/v2/self/mfa/TOTP' },
    response: apiError(404, 3101),
    code: 'clever.auth.mfa-not-found',
  },
];

describe('auth commands error codes', () => {
  let newScenario: NewScenario;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterAll(hooks.after);

  function createClient(): CcApiClient {
    return new CcApiClient({
      baseUrl: newScenario.mockClient.baseUrl,
      resourceIdResolverStore: new MemoryStore<ResourceIdIndex>(),
    });
  }

  it.each(CASES)('$name', async ({ command, request, response, code }) => {
    await newScenario().when(request).respond(response);

    await expectPromiseThrows(createClient().send(command()), (error: CcHttpError) => {
      expect(error.code).toBe(code);
    });
  });

});
