/**
 * @import { CheckVatNumberCommandInput, CheckVatNumberCommandOutput } from './check-vat-number-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CheckVatNumberCommandInput, CheckVatNumberCommandOutput>}
 * @endpoint [GET] /v2/vat_check
 * @group VatNumber
 * @version 2
 */
export class CheckVatNumberCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CheckVatNumberCommandInput, CheckVatNumberCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      `/v2/vat_check`,
      new QueryParams().append('country', params.country).append('vat', params.vatNumber.substring(2)),
    );
  }

  /** @type {CcApiSimpleCommand<CheckVatNumberCommandInput, CheckVatNumberCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    if (response.valid) {
      return response;
    }
    return {
      valid: false,
    };
  }
}
