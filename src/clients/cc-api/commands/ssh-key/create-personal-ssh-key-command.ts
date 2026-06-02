import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type {
  CreatePersonalSshKeyCommandInput,
  CreatePersonalSshKeyCommandOutput,
} from './create-personal-ssh-key-command.types.js';
import { ListPersonalSshKeyCommand } from './list-personal-ssh-key-command.js';

/**
 * @endpoint [PUT] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class CreatePersonalSshKeyCommand extends CcApiCompositeCommand<
  CreatePersonalSshKeyCommandInput,
  CreatePersonalSshKeyCommandOutput
> {
  async compose(
    params: CreatePersonalSshKeyCommandInput,
    composer: CcApiComposer,
  ): Promise<CreatePersonalSshKeyCommandOutput> {
    await composer.send(new CreatePersonalSshKeyInnerCommand(params));
    const keys = await composer.send(new ListPersonalSshKeyCommand());
    return keys.find((key) => key.name === params.name);
  }
}

/**
 * @endpoint [PUT] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class CreatePersonalSshKeyInnerCommand extends CcApiSimpleCommand<CreatePersonalSshKeyCommandInput, void> {
  toRequestParams(params: CreatePersonalSshKeyCommandInput): Partial<CcRequestParams> {
    return {
      method: 'PUT',
      url: safeUrl`/v2/self/keys/${params.name}`,
      headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
      body: params.key,
    };
  }

  transformCommandOutput(): void {
    return null;
  }
}
