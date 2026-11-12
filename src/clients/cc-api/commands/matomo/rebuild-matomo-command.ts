import { post } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import type { RebuildMatomoCommandInput } from './rebuild-matomo-command.types.ts';

/**
 * Rebuilds the Matomo instance backing an add-on from scratch, keeping its data.
 *
 * Slower than a reboot, but it also picks up the platform changes a restart would not.
 *
 * @endpoint [POST] /v4/addon-providers/addon-matomo/addons/:XXX/rebuild
 * @group Matomo
 * @version 4
 */
export class RebuildMatomoCommand extends CcApiSimpleCommand<RebuildMatomoCommandInput, undefined> {
  toRequestParams(params: RebuildMatomoCommandInput) {
    return post(safeUrl`/v4/addon-providers/addon-matomo/addons/${params.addonId}/rebuild`);
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // each call queues a cacheless redeployment, so a replay rebuilds the instance a second time
  isIdempotent(): boolean {
    return false;
  }
}
