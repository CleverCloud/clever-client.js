import { get } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetPulsarClusterInnerCommandInput,
  GetPulsarClusterInnerCommandOutput,
  GetPulsarInfoCommandInput,
  GetPulsarInfoCommandOutput,
  GetPulsarInfoInnerCommandOutput,
} from './get-pulsar-info-command.types.js';
import { transformPulsarCluster, transformPulsarInfo } from './pulsar-transform.js';

/**
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/clusters/:XXX
 * @group Pulsar
 * @version 4
 */
export class GetPulsarInfoCommand extends CcApiCompositeCommand<GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput> {
  async compose(params: GetPulsarInfoCommandInput, composer: CcApiComposer): Promise<GetPulsarInfoCommandOutput> {
    const pulsarInfo = await composer.send(new GetPulsarInfoInnerCommand(params));

    if (pulsarInfo == null) {
      return null;
    }

    const pulsarCluster = await composer.send(new GetPulsarClusterCommand({ clusterId: pulsarInfo.clusterId }));

    return {
      ...omit(pulsarInfo, 'clusterId'),
      cluster: pulsarCluster,
    };
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @group Pulsar
 * @version 4
 */
class GetPulsarInfoInnerCommand extends CcApiSimpleCommand<GetPulsarInfoCommandInput, GetPulsarInfoInnerCommandOutput> {
  toRequestParams(params: GetPulsarInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-pulsar/addons/${params.addonId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetPulsarInfoInnerCommandOutput {
    return transformPulsarInfo(response);
  }
}

/**
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/clusters/:XXX
 * @group Pulsar
 * @version 4
 */
class GetPulsarClusterCommand extends CcApiSimpleCommand<
  GetPulsarClusterInnerCommandInput,
  GetPulsarClusterInnerCommandOutput
> {
  toRequestParams(params: GetPulsarClusterInnerCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-pulsar/clusters/${params.clusterId}`);
  }

  transformCommandOutput(response: unknown): GetPulsarClusterInnerCommandOutput {
    return transformPulsarCluster(response);
  }
}
