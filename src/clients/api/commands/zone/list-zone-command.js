/**
 * @import { ListZoneCommandOutput } from './list-zone-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<void, ListZoneCommandOutput>}
 * @endpoint [GET] /v4/products/zones
 * @group Zone
 * @version 4
 */
export class ListZoneCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<void, ListZoneCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(`/v4/products/zones`);
  }

  /** @type {CcApiSimpleCommand<void, ListZoneCommandOutput>['isEmptyResponse']} */
  isEmptyResponse(status) {
    return status === 404;
  }
}
