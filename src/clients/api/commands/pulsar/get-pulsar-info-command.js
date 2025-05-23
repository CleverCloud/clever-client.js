/**
 * @import { GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput } from './get-pulsar-info-command.types.js';
 */
import { CcApiCompositeCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/:XXX/clusters/:XXX
 * @group Pulsar
 * @version 4
 */
export class GetPulsarInfoCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput>['compose']} */
  async compose(params, composer) {}
}
