import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { CcApiClient } from '../../../../../../src/clients/cc-api/cc-api-client.js';
import type { ResolveRefusedCredentialInput } from '../../../../../../src/clients/cc-api/commands/auth/auth.types.js';
import { ConfirmAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/confirm-auth-mfa-command.js';
import type { ConfirmAuthMfaResult } from '../../../../../../src/clients/cc-api/commands/auth/confirm-auth-mfa-command.types.js';
import { CreateAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/create-auth-mfa-command.js';
import type {
  CreateAuthMfaCommandInput,
  CreateAuthMfaCommandResponse,
  CreateAuthMfaResult,
} from '../../../../../../src/clients/cc-api/commands/auth/create-auth-mfa-command.types.js';
import { DeleteAuthMfaCommand } from '../../../../../../src/clients/cc-api/commands/auth/delete-auth-mfa-command.js';
import { GetAuthMfaBackupCodesCommand } from '../../../../../../src/clients/cc-api/commands/auth/get-auth-mfa-backup-codes-command.js';
import type { CcApiCompositeCommand } from '../../../../../../src/clients/cc-api/lib/cc-api-command.js';
import { MemoryStore } from '../../../../../../src/clients/cc-api/lib/store/memory-store.js';
import type { ResourceIdIndex } from '../../../../../../src/clients/cc-api/types/resource-id-resolver.types.js';
import { CcHttpError } from '../../../../../../src/lib/error/cc-client-errors.js';
import { expectPromiseThrows } from '../../../../../lib/expect-utils.js';

/** What `client.send()` resolves to for a given command, without sending anything. */
function outputOf<CommandInput, CommandOutput>(
  _command: CcApiCompositeCommand<CommandInput, CommandOutput>,
): CommandOutput {
  return undefined as CommandOutput;
}

const WRONG_PASSWORD = { status: 401, body: { id: 3029, message: 'Wrong password provided', type: 'error' } };
const MFA_BAD_CODE = {
  status: 400,
  body: { id: 3103, message: 'Your code is invalid for the multi factor authentication kind', type: 'error' },
};

const AUTH = { kind: 'TOTP', password: 'password' } as const;

/** Any of the commands below, loose enough for `client.send()` to take each of them. */
type AuthMfaCommand = CcApiCompositeCommand<ResolveRefusedCredentialInput, unknown>;

/** Each command asking for the password again, with the request it sends and what it resolves. */
const COMMANDS: Array<{
  name: string;
  create: (flag?: boolean) => AuthMfaCommand;
  request: { method: string; path: string };
  response: { status: number; body: unknown };
  output: unknown;
  result: unknown;
}> = [
  {
    name: 'CreateAuthMfaCommand',
    create: (flag?: boolean) => new CreateAuthMfaCommand({ ...AUTH, shouldResolveRefusedCredential: flag }),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP' },
    response: { status: 200, body: { url: 'otpauth://totp/x?secret=S' } },
    output: { url: 'otpauth://totp/x?secret=S' },
    result: { type: 'created', url: 'otpauth://totp/x?secret=S' },
  },
  {
    name: 'DeleteAuthMfaCommand',
    create: (flag?: boolean) => new DeleteAuthMfaCommand({ ...AUTH, shouldResolveRefusedCredential: flag }),
    request: { method: 'DELETE', path: '/v2/self/mfa/TOTP' },
    response: { status: 200, body: { id: 0, message: 'ok', type: 'success' } },
    output: undefined,
    result: { type: 'deleted' },
  },
  {
    name: 'GetAuthMfaBackupCodesCommand',
    create: (flag?: boolean) => new GetAuthMfaBackupCodesCommand({ ...AUTH, shouldResolveRefusedCredential: flag }),
    request: { method: 'GET', path: '/v2/self/mfa/TOTP/backupcodes' },
    response: { status: 200, body: [{ code: 'a' }, { code: 'b' }] },
    output: ['a', 'b'],
    result: { type: 'retrieved', backupCodes: ['a', 'b'] },
  },
  {
    name: 'ConfirmAuthMfaCommand',
    create: (flag?: boolean) =>
      new ConfirmAuthMfaCommand({ ...AUTH, code: '123456', shouldResolveRefusedCredential: flag }),
    request: { method: 'POST', path: '/v2/self/mfa/TOTP/confirmation' },
    response: { status: 200, body: { id: 0, message: 'ok', type: 'success' } },
    output: undefined,
    result: { type: 'confirmed' },
  },
];

describe('auth MFA commands', () => {
  let newScenario: NewScenario;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterAll(hooks.after);

  function createClient(onError: (error: unknown) => void): CcApiClient {
    return new CcApiClient({
      baseUrl: newScenario.mockClient.baseUrl,
      resourceIdResolverStore: new MemoryStore<ResourceIdIndex>(),
      hooks: { onError },
    });
  }

  // the command is generic for this: only the input says whether a refused credential resolves
  it('should type its output after `shouldResolveRefusedCredential`', () => {
    expectTypeOf(outputOf(new CreateAuthMfaCommand(AUTH))).toEqualTypeOf<CreateAuthMfaCommandResponse>();
    expectTypeOf(
      outputOf(new CreateAuthMfaCommand({ ...AUTH, shouldResolveRefusedCredential: false })),
    ).toEqualTypeOf<CreateAuthMfaCommandResponse>();
    expectTypeOf(
      outputOf(new CreateAuthMfaCommand({ ...AUTH, shouldResolveRefusedCredential: true })),
    ).toEqualTypeOf<CreateAuthMfaResult>();
    const input: CreateAuthMfaCommandInput = AUTH;
    expectTypeOf(outputOf(new CreateAuthMfaCommand(input))).toEqualTypeOf<
      CreateAuthMfaCommandResponse | CreateAuthMfaResult
    >();
    expectTypeOf(
      outputOf(new ConfirmAuthMfaCommand({ ...AUTH, code: '123456', shouldResolveRefusedCredential: true })),
    ).toEqualTypeOf<ConfirmAuthMfaResult>();
  });

  describe.each(COMMANDS)('$name', ({ create, request, response, output, result }) => {
    describe('by default', () => {
      it('should resolve the response', async () => {
        await newScenario().when(request).respond(response);

        expect(await createClient(vi.fn()).send(create())).toEqual(output);
      });

      it('should reject and report a refused password', async () => {
        const onError = vi.fn();
        await newScenario().when(request).respond(WRONG_PASSWORD);

        await expectPromiseThrows(createClient(onError).send(create()), (error: CcHttpError) => {
          expect(error).toBeInstanceOf(CcHttpError);
          expect(error.code).toBe('clever.auth.invalid-password');
          expect(onError).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('with `shouldResolveRefusedCredential`', () => {
      it('should resolve the success', async () => {
        await newScenario().when(request).respond(response);

        expect(await createClient(vi.fn()).send(create(true))).toEqual(result);
      });

      // cc-api answers a wrong password with a 401, which an `onError` listener takes for an expired session
      it('should resolve a refused password without reporting it', async () => {
        const onError = vi.fn();
        await newScenario().when(request).respond(WRONG_PASSWORD);

        expect(await createClient(onError).send(create(true))).toEqual({ type: 'invalid-password' });
        expect(onError).not.toHaveBeenCalled();
      });

      it('should reject and report any other error', async () => {
        const onError = vi.fn();
        await newScenario()
          .when(request)
          .respond({
            status: 403,
            body: { id: 7301, message: "You are not allowed to access this user's data", type: 'error' },
          });

        await expectPromiseThrows(createClient(onError).send(create(true)), (error: CcHttpError) => {
          expect(error).toBeInstanceOf(CcHttpError);
          expect(error.code).toBe('7301');
          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError.mock.calls[0][0]).toBe(error);
        });
      });
    });
  });

  describe('ConfirmAuthMfaCommand', () => {
    const request = { method: 'POST', path: '/v2/self/mfa/TOTP/confirmation' } as const;
    const command = (flag?: boolean) =>
      new ConfirmAuthMfaCommand({ ...AUTH, code: '123456', shouldResolveRefusedCredential: flag });

    it('should reject and report a refused code by default', async () => {
      const onError = vi.fn();
      await newScenario().when(request).respond(MFA_BAD_CODE);

      await expectPromiseThrows(createClient(onError).send(command()), (error: CcHttpError) => {
        expect(error.code).toBe('clever.auth.invalid-mfa-code');
        expect(onError).toHaveBeenCalledTimes(1);
      });
    });

    it('should resolve a refused code without reporting it with `shouldResolveRefusedCredential`', async () => {
      const onError = vi.fn();
      await newScenario().when(request).respond(MFA_BAD_CODE);

      expect(await createClient(onError).send(command(true))).toEqual({ type: 'invalid-mfa-code' });
      expect(onError).not.toHaveBeenCalled();
    });

    // the other commands meet no code, so a refused one is not theirs to resolve
    it('should reject a refused code on a command that meets none', async () => {
      const onError = vi.fn();
      await newScenario().when({ method: 'POST', path: '/v2/self/mfa/TOTP' }).respond(MFA_BAD_CODE);

      await expectPromiseThrows(
        createClient(onError).send(new CreateAuthMfaCommand({ ...AUTH, shouldResolveRefusedCredential: true })),
        (error: CcHttpError) => {
          expect(error.code).toBe('3103');
          expect(onError).toHaveBeenCalledTimes(1);
        },
      );
    });
  });
});
