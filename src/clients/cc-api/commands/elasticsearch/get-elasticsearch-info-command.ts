import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformElasticsearchInfo } from './elasticsearch-transform.js';
import type {
  GetElasticsearchInfoCommandInput,
  GetElasticsearchInfoCommandOutput,
} from './get-elasticsearch-info-command.types.js';

/**
 * @endpoint [GET] /v2/providers/es-addon/:XXX
 * @group Elasticsearch
 * @version 2
 */
export class GetElasticsearchInfoCommand extends CcApiSimpleCommand<
  GetElasticsearchInfoCommandInput,
  GetElasticsearchInfoCommandOutput
> {
  toRequestParams(params: GetElasticsearchInfoCommandInput) {
    return get(safeUrl`/v2/providers/es-addon/${params.addonId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetElasticsearchInfoCommandOutput {
    return transformElasticsearchInfo(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'ADDON_ID',
    };
  }
}
