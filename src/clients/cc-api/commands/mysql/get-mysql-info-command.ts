import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { GetMysqlInfoCommandInput, GetMysqlInfoCommandOutput } from './get-mysql-info-command.types.ts';
import { transformMysqlInfo } from './mysql-transform.ts';

/**
 * Retrieves the details of a MySQL add-on: its version, plan, zone and status, the database it serves with its credentials, and its features.
 *
 * @endpoint [GET] /v4/addon-providers/mysql-addon/addons/:XXX
 * @group Mysql
 * @version 4
 */
export class GetMysqlInfoCommand extends CcApiSimpleCommand<GetMysqlInfoCommandInput, GetMysqlInfoCommandOutput> {
  toRequestParams(params: GetMysqlInfoCommandInput) {
    // The MySQL provider looks its add-ons up by the add-on id, not by the real id other providers use on this route.
    return get(safeUrl`/v4/addon-providers/mysql-addon/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetMysqlInfoCommandOutput {
    return transformMysqlInfo(response);
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
