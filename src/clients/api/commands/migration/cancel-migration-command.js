/**
 * @import { CancelMigrationCommandInput } from './cancel-migration-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CancelMigrationCommandInput, void>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX/migrations/:XXX
 * @group Migration
 * @version 2
 */
export class CancelMigrationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CancelMigrationCommandInput, void>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/${params.ownerId}addons/${params.addonId}/migrations/:XXX`);
  }

  /** @type {CcApiSimpleCommand<CancelMigrationCommandInput, void>['transformCommandOutput']} */
  transformCommandOutput() {
    return null;
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
