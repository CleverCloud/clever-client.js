/**
 * @import { ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput } from './list-migration-preorder-command.types.js';
 */
import { QueryParams } from '../../../../lib/request/query-params.js';
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput>}
 * @endpoint [GET] /v2/organisations/:XXX/addons/:XXX/migrations/preorders
 * @group Migration
 * @version 2
 */
export class ListMigrationPreorderCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(
      safeUrl`/v2/organisations/${params.ownerId}/addons/${params.addonId}/migrations/preorders`,
      new QueryParams().set('planId', params.planId),
    );
  }

  /** @type {CcApiSimpleCommand<ListMigrationPreorderCommandInput, ListMigrationPreorderCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      ownerId: response.ownerId,
      target: response.target,
      emissionDate: normalizeDate(response.emissionDate),
      name: response.name,
      company: response.company,
      VAT: response.VAT,
      type: response.type,
      lines: sortBy(
        response.lines?.map(
          /** @param {any} line */ (line) => ({
            type: line.type,
            description: line.description,
            quantity: line.quantity,
            tva: line.tva,
            priceUnitHt: line.price_unit_ht,
            priceTotalHt: line.price_total_ht,
            pack: line.pack,
            dropQuantity: line.dropQuantity,
            coupon: line.coupon,
            discount: 0,
          }),
        ) ?? [],
        'priceTotalHt',
      ),
    };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getEmptyResponsePolicy']} */
  getEmptyResponsePolicy(status) {
    return { isEmpty: status === 404 };
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
