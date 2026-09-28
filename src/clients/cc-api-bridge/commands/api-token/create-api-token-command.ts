import { post } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, pickNonNull } from '../../../../lib/utils.js';
import { isCcHttpErrorWithCode } from '../../../../utils/error-utils.js';
import { CcApiBridgeCommand, CcApiBridgeCompositeCommand } from '../../lib/cc-api-bridge-command.js';
import type { CcApiBridgeComposer } from '../../types/cc-api-bridge.types.js';
import { transformCreatedApiToken } from './api-token-transform.js';
import type {
  CreateApiTokenCommandInput,
  CreateApiTokenCommandOutput,
  CreateApiTokenCommandResponse,
  CreateApiTokenResult,
} from './create-api-token-command.types.js';

const REFUSED_CREDENTIAL_CODES = ['invalid-credential', 'invalid-mfa-code'] as const;

/**
 * Mints a new API token for an account.
 *
 * The account credentials are passed in the body rather than taken from the client, and the token
 * value is only returned by this call, so it has to be stored right away.
 *
 * A refused credential rejects, unless `shouldResolveRefusedCredential` is set: it then resolves with
 * its code in `type`, and the `hooks.onError` callback of the client never sees it.
 *
 * @endpoint [POST] /api-tokens
 * @group ApiToken
 */
export class CreateApiTokenCommand<
  TInput extends CreateApiTokenCommandInput = CreateApiTokenCommandInput,
> extends CcApiBridgeCompositeCommand<TInput, CreateApiTokenCommandOutput<TInput>> {
  async compose(params: TInput, composer: CcApiBridgeComposer): Promise<CreateApiTokenCommandOutput<TInput>> {
    // TypeScript cannot narrow a conditional type on a runtime check, so each branch asserts it
    if (params.shouldResolveRefusedCredential !== true) {
      return (await composer.send(new CreateApiTokenInnerCommand(params))) as CreateApiTokenCommandOutput<TInput>;
    }
    return (await createResolvingRefusal(params, composer)) as CreateApiTokenCommandOutput<TInput>;
  }

  isIdempotent(): boolean {
    return false;
  }
}

async function createResolvingRefusal(
  params: CreateApiTokenCommandInput,
  composer: CcApiBridgeComposer,
): Promise<CreateApiTokenResult> {
  try {
    const token = await composer.send(new CreateApiTokenInnerCommand(params));
    return { type: 'created', ...token };
  } catch (error) {
    const refusedCode = REFUSED_CREDENTIAL_CODES.find((code) => isCcHttpErrorWithCode(error, code));
    if (refusedCode == null) {
      throw error;
    }
    return { type: refusedCode };
  }
}

/**
 * Mints the token, rejecting on a refused credential.
 *
 * @endpoint [POST] /api-tokens
 * @group ApiToken
 */
class CreateApiTokenInnerCommand extends CcApiBridgeCommand<CreateApiTokenCommandInput, CreateApiTokenCommandResponse> {
  toRequestParams(params: CreateApiTokenCommandInput) {
    return post(
      `/api-tokens`,
      pickNonNull({
        email: params.emailAddress,
        password: params.password,
        mfaCode: params.mfaCode,
        name: params.name,
        description: params.description,
        expirationDate: normalizeDate(params.expiresAt),
      }),
    );
  }

  transformCommandOutput(response: unknown): CreateApiTokenCommandResponse {
    return transformCreatedApiToken(response);
  }

  isAuthEnabled(): boolean {
    return false;
  }

  // each call runs a full OAuth dance and generates a new token id, so a replay mints a second token
  isIdempotent(): boolean {
    return false;
  }
}
