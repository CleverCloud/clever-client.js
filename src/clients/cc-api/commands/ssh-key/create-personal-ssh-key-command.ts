/**
 * @import { CreatePersonalSshKeyCommandInput, CreatePersonalSshKeyCommandOutput } from './create-personal-ssh-key-command.types.js';
 * @import { SshKey } from './ssh-key.types.js';
 */
import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { ListPersonalSshKeyCommand } from './list-personal-ssh-key-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<CreatePersonalSshKeyCommandInput, CreatePersonalSshKeyCommandOutput>}
 * @endpoint [PUT] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class CreatePersonalSshKeyCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<CreatePersonalSshKeyCommandInput, CreatePersonalSshKeyCommandOutput>['compose']} */
  async compose(params, composer) {
    await composer.send(new CreatePersonalSshKeyInnerCommand(params));
    const keys = await composer.send(new ListPersonalSshKeyCommand());
    return keys.find(/** @param {SshKey} key */ (key) => key.name === params.name);
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<CreatePersonalSshKeyCommandInput, void>}
 * @endpoint [PUT] /v2/self/keys/:XXX
 * @group SshKey
 * @version 2
 */
export class CreatePersonalSshKeyInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CreatePersonalSshKeyCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return {
      method: 'PUT',
      url: safeUrl`/v2/self/keys/${params.name}`,
      headers: new HeadersBuilder().acceptJson().contentTypeJson().build(),
      body: params.key,
    };
  }

  /** @type {CcApiSimpleCommand<CreatePersonalSshKeyCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }
}
