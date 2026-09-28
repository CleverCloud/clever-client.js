import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { CcApiBridgeClient } from '../../../../../../src/clients/cc-api-bridge/cc-api-bridge-client.js';
import { CreateApiTokenCommand } from '../../../../../../src/clients/cc-api-bridge/commands/api-token/create-api-token-command.js';
import type {
  CreateApiTokenCommandInput,
  CreateApiTokenCommandResponse,
  CreateApiTokenResult,
} from '../../../../../../src/clients/cc-api-bridge/commands/api-token/create-api-token-command.types.js';
import type { CcApiBridgeCompositeCommand } from '../../../../../../src/clients/cc-api-bridge/lib/cc-api-bridge-command.js';
import { CcHttpError } from '../../../../../../src/lib/error/cc-client-errors.js';
import { expectPromiseThrows } from '../../../../../lib/expect-utils.js';

/** What `client.send()` resolves to for a given command, without sending anything. */
function outputOf<CommandInput, CommandOutput>(
  _command: CcApiBridgeCompositeCommand<CommandInput, CommandOutput>,
): CommandOutput {
  return undefined as CommandOutput;
}

const INPUT = {
  emailAddress: 'user@example.com',
  password: 'password',
  name: 'token',
  expiresAt: '2030-01-01T00:00:00.000Z',
};

const RAW_TOKEN = {
  apiToken: 'api_token',
  apiTokenId: 'api_token_id',
  creationDate: '2029-01-01T00:00:00.000Z',
  expirationDate: '2030-01-01T00:00:00.000Z',
  name: 'token',
  state: 'ACTIVE',
};

const TOKEN = {
  apiToken: 'api_token',
  apiTokenId: 'api_token_id',
  createdAt: '2029-01-01T00:00:00.000Z',
  expiresAt: '2030-01-01T00:00:00.000Z',
  name: 'token',
  description: undefined,
  state: 'ACTIVE',
};

describe('CreateApiTokenCommand', () => {
  let newScenario: NewScenario;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterAll(hooks.after);

  function createClient(onError: (error: unknown) => void): CcApiBridgeClient {
    return new CcApiBridgeClient({
      baseUrl: newScenario.mockClient.baseUrl,
      oauthTokens: { consumerKey: 'ck', consumerSecret: 'cs', token: 't', secret: 's' },
      hooks: { onError },
    });
  }

  // the command is generic for this: only the input says whether a refused credential resolves
  it('should type its output after `shouldResolveRefusedCredential`', () => {
    expectTypeOf(outputOf(new CreateApiTokenCommand(INPUT))).toEqualTypeOf<CreateApiTokenCommandResponse>();
    expectTypeOf(
      outputOf(new CreateApiTokenCommand({ ...INPUT, shouldResolveRefusedCredential: false })),
    ).toEqualTypeOf<CreateApiTokenCommandResponse>();
    expectTypeOf(
      outputOf(new CreateApiTokenCommand({ ...INPUT, shouldResolveRefusedCredential: true })),
    ).toEqualTypeOf<CreateApiTokenResult>();
    const input: CreateApiTokenCommandInput = INPUT;
    expectTypeOf(outputOf(new CreateApiTokenCommand(input))).toEqualTypeOf<
      CreateApiTokenCommandResponse | CreateApiTokenResult
    >();
  });

  describe('by default', () => {
    it('should resolve the created token', async () => {
      await newScenario().when({ method: 'POST', path: '/api-tokens' }).respond({ status: 200, body: RAW_TOKEN });

      const result = await createClient(vi.fn()).send(new CreateApiTokenCommand(INPUT));

      expect(result).toEqual(TOKEN);
    });

    it('should reject and report a refused credential', async () => {
      const onError = vi.fn();
      await newScenario()
        .when({ method: 'POST', path: '/api-tokens' })
        .respond({ status: 401, body: { code: 'invalid-credential', message: 'Invalid credential' } });

      await expectPromiseThrows(createClient(onError).send(new CreateApiTokenCommand(INPUT)), (error: CcHttpError) => {
        expect(error).toBeInstanceOf(CcHttpError);
        expect(error.code).toBe('invalid-credential');
        expect(onError).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('with `shouldResolveRefusedCredential`', () => {
    const command = () => new CreateApiTokenCommand({ ...INPUT, shouldResolveRefusedCredential: true });

    it('should resolve the created token', async () => {
      await newScenario().when({ method: 'POST', path: '/api-tokens' }).respond({ status: 200, body: RAW_TOKEN });

      const result = await createClient(vi.fn()).send(command());

      expect(result).toEqual({ type: 'created', ...TOKEN });
    });

    // the bridge answers a refused credential with a 401, which an `onError` listener takes for an expired session
    it.each(['invalid-credential', 'invalid-mfa-code'])(
      'should resolve a refused credential `%s` without reporting it',
      async (code) => {
        const onError = vi.fn();
        await newScenario()
          .when({ method: 'POST', path: '/api-tokens' })
          .respond({ status: 401, body: { code, message: 'refused' } });

        const result = await createClient(onError).send(command());

        expect(result).toEqual({ type: code });
        expect(onError).not.toHaveBeenCalled();
      },
    );

    it('should reject and report any other error', async () => {
      const onError = vi.fn();
      await newScenario()
        .when({ method: 'POST', path: '/api-tokens' })
        .respond({ status: 500, body: { code: 'failed-token-creation-2', message: 'Token creation failed' } });

      await expectPromiseThrows(createClient(onError).send(command()), (error: CcHttpError) => {
        expect(error).toBeInstanceOf(CcHttpError);
        expect(error.code).toBe('failed-token-creation-2');
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0]).toBe(error);
      });
    });
  });
});
