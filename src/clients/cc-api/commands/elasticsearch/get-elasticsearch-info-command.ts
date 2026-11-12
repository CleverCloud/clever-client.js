import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformElasticsearchInfo } from './elasticsearch-transform.ts';
import type {
  GetElasticsearchInfoCommandInput,
  GetElasticsearchInfoCommandOutput,
} from './get-elasticsearch-info-command.types.ts';

/**
 * Retrieves the details of an Elasticsearch add-on: its plan and zone, the credentials of its Elasticsearch, Kibana
 * and APM endpoints, and the optional services and features it runs.
 *
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

  transformCommandOutput(response: unknown): GetElasticsearchInfoCommandOutput {
    return transformElasticsearchInfo(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'ADDON_ID',
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
