/**
 * @import { CancelMigrationCommandInput, CancelMigrationCommandOutput } from './cancel-migration-command.types.js';
 */
import { delete_ } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiSimpleCommand<CancelMigrationCommandInput, CancelMigrationCommandOutput>}
 * @endpoint [DELETE] /v2/organisations/:XXX/addons/:XXX/migrations/:XXX
 * @group Migration
 * @version 2
 */
export class CancelMigrationCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<CancelMigrationCommandInput, CancelMigrationCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return delete_(safeUrl`/v2/organisations/:XXX/addons/:XXX/migrations/:XXX`);
  }

  /** @type {CcApiSimpleCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      ownerId: true,
      addonId: 'ADDON_ID',
    };
  }
}
