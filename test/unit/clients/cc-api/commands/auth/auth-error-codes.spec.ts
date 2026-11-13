import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CcApiClient } from '../../../../../../src/clients/cc-api/cc-api-client.ts';
import { ConfirmAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/confirm-auth-mfa-command.ts';
import { CreateAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/create-auth-mfa-command.ts';
import { DeleteAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/delete-auth-mfa-command.ts';
import { GetAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/get-auth-mfa-command.ts';
import { RequestAuthPasswordResetCommand } from '../../../../../../src/clients/cc-api/commands/auth/request-auth-password-reset-command.ts';
import { ResetAuthMfaBackupCodesCommand } from '../../../../../../src/clients/cc-api/commands/auth/reset-auth-mfa-backup-codes-command.ts';
import { UpdateAuthPasswordCommand } from '../../../../../../src/clients/cc-api/commands/auth/update-auth-password-command.ts';
import { MemoryStore } from '../../../../../../src/clients/cc-api/lib/store/memory-store.ts';
import type { ResourceIdIndex } from '../../../../../../src/clients/cc-api/types/resource-id-resolver.types.ts';
import type { CcHttpError } from '../../../../../../src/lib/error/cc-client-errors.ts';
import type { Command } from '../../../../../../src/types/command.types.ts';
import { expectPromiseThrows } from '../../../../../lib/expect-utils.ts';

const AUTH = { kind: 'TOTP', password: 'password' } as const;
const PASSWORDS = { oldPassword: 'old-password', newPassword: 'new-password' };

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
    name: 'CreateAuthMfaCommand: token not almighty',
    command: () => new CreateAuthMfaCommand(AUTH),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP' },
    response: apiError(403, 7301),
    code: 'clever.auth.almighty-token-required',
  },
  {
    name: 'DeleteAuthMfaCommand: factor not active',
    command: () => new DeleteAuthMfaCommand(AUTH),
    request: { method: 'DELETE', path: '/v2/self/mfa/TOTP' },
    response: apiError(404, 3101),
    code: 'clever.auth.mfa-not-found',
  },
  {
    name: 'DeleteAuthMfaCommand: token not almighty',
    command: () => new DeleteAuthMfaCommand(AUTH),
    request: { method: 'DELETE', path: '/v2/self/mfa/TOTP' },
    response: apiError(403, 7301),
    code: 'clever.auth.almighty-token-required',
  },
  {
    name: 'GetAuthMfaCommand: token not almighty',
    command: () => new GetAuthMfaCommand({ kind: 'TOTP' }),
    request: { method: 'GET', path: '/v2/self/mfa/TOTP' },
    response: apiError(403, 7301),
    code: 'clever.auth.almighty-token-required',
  },
  {
    name: 'ResetAuthMfaBackupCodesCommand: factor not active',
    command: () => new ResetAuthMfaBackupCodesCommand(AUTH),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/backupcodes' },
    response: apiError(404, 3101),
    code: 'clever.auth.mfa-not-found',
  },
  {
    name: 'ResetAuthMfaBackupCodesCommand: token not almighty',
    command: () => new ResetAuthMfaBackupCodesCommand(AUTH),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/backupcodes' },
    response: apiError(403, 7301),
    code: 'clever.auth.almighty-token-required',
  },
  {
    name: 'ConfirmAuthMfaCommand: wrong code',
    command: () => new ConfirmAuthMfaCommand({ ...AUTH, code: '123456' }),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/confirmation' },
    response: apiError(400, 3103),
    code: 'clever.auth.invalid-mfa-code',
  },
  {
    name: 'ConfirmAuthMfaCommand: factor already active',
    command: () => new ConfirmAuthMfaCommand({ ...AUTH, code: '123456' }),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/confirmation' },
    response: apiError(409, 3102),
    code: 'clever.auth.mfa-already-enabled',
  },
  {
    name: 'ConfirmAuthMfaCommand: no enrolment started',
    command: () => new ConfirmAuthMfaCommand({ ...AUTH, code: '123456' }),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/confirmation' },
    response: apiError(404, 3101),
    code: 'clever.auth.mfa-enrolment-not-found',
  },
  {
    name: 'ConfirmAuthMfaCommand: token not almighty',
    command: () => new ConfirmAuthMfaCommand({ ...AUTH, code: '123456' }),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/confirmation' },
    response: apiError(403, 7301),
    code: 'clever.auth.almighty-token-required',
  },
  {
    name: 'UpdateAuthPasswordCommand: wrong current password',
    command: () => new UpdateAuthPasswordCommand(PASSWORDS),
    request: { method: 'PUT', path: '/v2/self/change_password' },
    response: apiError(403, 7301),
    code: 'clever.auth.invalid-password',
  },
  {
    name: 'UpdateAuthPasswordCommand: new password too short or too long',
    command: () => new UpdateAuthPasswordCommand(PASSWORDS),
    request: { method: 'PUT', path: '/v2/self/change_password' },
    response: apiError(400, 3002),
    code: 'clever.auth.invalid-new-password',
  },
  {
    name: 'UpdateAuthPasswordCommand: no stored password',
    command: () => new UpdateAuthPasswordCommand(PASSWORDS),
    request: { method: 'PUT', path: '/v2/self/change_password' },
    response: apiError(400, 504, { fields: { oldPassword: 'Password does not match' } }),
    code: 'clever.auth.password-not-set',
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

  // the mock server cannot parse the form this command posts, so its mapping is checked on its own
  it('RequestAuthPasswordResetCommand: email not sent', () => {
    const command = new RequestAuthPasswordResetCommand({ login: 'user@example.com' });

    expect(command.transformErrorCode({ code: '2401', status: 500, body: apiError(500, 2401).body })).toBe(
      'clever.auth.password-reset-email-failed',
    );
  });
});
