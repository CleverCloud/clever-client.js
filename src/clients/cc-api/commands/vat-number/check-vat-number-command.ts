import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CheckVatNumberCommandInput, CheckVatNumberCommandOutput } from './check-vat-number-command.types.js';
import { transformVatNumber } from './vat-number-transform.js';

/**
 * Checks a VAT number against the European VIES registry.
 *
 * The two-letter country prefix is stripped from the number before it is sent, since the country is
 * passed separately. A syntactically invalid number is reported as invalid rather than as an error.
 *
 * @endpoint [GET] /v2/vat_check
 * @group VatNumber
 * @version 2
 */
export class CheckVatNumberCommand extends CcApiSimpleCommand<CheckVatNumberCommandInput, CheckVatNumberCommandOutput> {
  toRequestParams(params: CheckVatNumberCommandInput) {
    return get(
      `/v2/vat_check`,
      new QueryParams().append('country', params.country).append('vat', params.vatNumber.substring(2)),
    );
  }

  transformCommandOutput(response: unknown): CheckVatNumberCommandOutput {
    return transformVatNumber(response);
  }

  // the VIES lookup only caches its answer under the number asked about
  isIdempotent(): boolean {
    return true;
  }
}
