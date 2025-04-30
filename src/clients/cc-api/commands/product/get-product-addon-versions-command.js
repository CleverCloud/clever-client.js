/**
 * @import { GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput } from './get-product-addon-versions-command.types.js';
 * @import { ProductAddonClusterVersion } from './product.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/:XXX
 * @group Product
 * @version 4
 */
export class GetProductAddonVersionsCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/${params.id}`);
  }

  /** @type {CcApiSimpleCommand<GetProductAddonVersionsCommandInput, GetProductAddonVersionsCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      clusters: sortBy(response.clusters.map(transformAddonVersionCluster), 'label'),
      dedicated: Object.fromEntries(
        Object.entries(response.dedicated).map(([k, v]) => [k, { features: sortBy(v.features, 'name') }]),
      ),
      defaultDedicatedVersion: response.defaultDedicatedVersion,
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }
}

/**
 * @param {any} cluster
 * @returns {ProductAddonClusterVersion}
 */
function transformAddonVersionCluster(cluster) {
  return {
    id: cluster.id,
    label: cluster.label,
    zone: cluster.zone,
    version: cluster.version,
    features: sortBy(cluster.version, 'name'),
  };
}
