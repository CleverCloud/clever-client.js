import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type {
  GetPostgresqlInfoCommandInput,
  GetPostgresqlInfoCommandOutput,
} from './get-postgresql-info-command.types.ts';
import { transformPostgresqlInfo } from './postgresql-transform.ts';

/**
 * Retrieves the details of a PostgreSQL add-on: its version, plan, zone and status, the database it serves with its credentials, and its features.
 *
 * @endpoint [GET] /v4/addon-providers/postgresql-addon/addons/:XXX
 * @group Postgresql
 * @version 4
 */
export class GetPostgresqlInfoCommand extends CcApiSimpleCommand<
  GetPostgresqlInfoCommandInput,
  GetPostgresqlInfoCommandOutput
> {
  toRequestParams(params: GetPostgresqlInfoCommandInput) {
    // The PostgreSQL provider looks its add-ons up by the add-on id, not by the real id other providers use on this route.
    return get(safeUrl`/v4/addon-providers/postgresql-addon/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetPostgresqlInfoCommandOutput {
    return transformPostgresqlInfo(response);
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
