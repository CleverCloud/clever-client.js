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
 * Retrieves the details of a Pulsar add-on, with the cluster it is hosted on.
 *
 * The add-on payload only carries the id of its cluster, so the command makes a second request to fetch the cluster
 * and inlines it as `cluster`.
 *
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/clusters/:XXX
 * @group Pulsar
 * @version 4
 */
export class GetPulsarInfoCommand extends CcApiCompositeCommand<GetPulsarInfoCommandInput, GetPulsarInfoCommandOutput> {
  async compose(params: GetPulsarInfoCommandInput, composer: CcApiComposer): Promise<GetPulsarInfoCommandOutput> {
    const pulsarInfo = await composer.send(new GetPulsarInfoInnerCommand(params));
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

  // both steps only read
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves the Pulsar add-on itself: its tenant, namespace and access token.
 *
 * @endpoint [GET] /v4/addon-providers/addon-pulsar/addons/:XXX
 * @group Pulsar
 * @version 4
 */
class GetPulsarInfoInnerCommand extends CcApiSimpleCommand<GetPulsarInfoCommandInput, GetPulsarInfoInnerCommandOutput> {
  toRequestParams(params: GetPulsarInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/addon-pulsar/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetPulsarInfoInnerCommandOutput {
    return transformPulsarInfo(response);
  }

  // the access token comes from the stored add-on row, renewing it is a separate route
  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves a Pulsar cluster: where it is reachable, which version it runs, and which plans it supports.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}
