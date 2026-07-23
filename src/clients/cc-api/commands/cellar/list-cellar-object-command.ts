import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformCellarObjectList } from './cellar-transform.js';
import type {
  ListCellarObjectCommandInput,
  ListCellarObjectCommandOutput,
} from './list-cellar-object-command.types.js';

/**
 * Lists one page of a bucket's contents, presented as objects and directories.
 *
 * Keys are split on slashes so the result reads like a file browser: a common prefix comes back as a
 * directory rather than as the objects under it.
 *
 * @endpoint [GET] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects
 * @group Cellar
 * @version 4
 */
export class ListCellarObjectCommand extends CcApiSimpleCommand<
  ListCellarObjectCommandInput,
  ListCellarObjectCommandOutput
> {
  toRequestParams(params: ListCellarObjectCommandInput) {
    return get(
      safeUrl`/v4/cellar/organisations/${params.ownerId}/cellar/${params.addonId}/buckets/${params.bucketName}/objects`,
      new QueryParams()
        .append('prefix', params.prefix)
        .append('cursor', params.cursor)
        .append('count', params.count)
        .append('withMetadata', params.withMetadata),
    );
  }

  transformCommandOutput(response: unknown): ListCellarObjectCommandOutput {
    return transformCellarObjectList(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }
}
