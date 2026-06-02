import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetJenkinsInfoCommandInput,
  GetJenkinsInfoCommandOutput,
  GetJenkinsInfoInnerCommandOutput,
  GetJenkinsUpdatesCommandOutput,
} from './get-jenkins-info-command.types.js';
import { transformJenkinsInfo } from './jenkins-transform.js';

/**
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX/updates
 * @group Jenkins
 * @version 4
 */
export class GetJenkinsInfoCommand extends CcApiCompositeCommand<
  GetJenkinsInfoCommandInput,
  GetJenkinsInfoCommandOutput
> {
  async compose(params: GetJenkinsInfoCommandInput, composer: CcApiComposer): Promise<GetJenkinsInfoCommandOutput> {
    const [internal, updates] = await Promise.all([
      composer.send(new GetJenkinsInfoInnerCommand(params)),
      composer.send(new GetJenkinsUpdatesCommand(params)),
    ]);

    if (internal == null || updates == null) {
      return null;
    }

    return {
      ...internal,
      updates,
    };
  }

  getIdsToResolve(): IdResolve {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX
 * @group Jenkins
 * @version 4
 */
class GetJenkinsInfoInnerCommand extends CcApiSimpleCommand<
  GetJenkinsInfoCommandInput,
  GetJenkinsInfoInnerCommandOutput
> {
  toRequestParams(params: GetJenkinsInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}`);
  }

  transformCommandOutput(response: unknown): GetJenkinsInfoInnerCommandOutput {
    return transformJenkinsInfo(response);
  }
}

/**
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX/updates
 * @group Jenkins
 * @version 4
 */
class GetJenkinsUpdatesCommand extends CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsUpdatesCommandOutput> {
  toRequestParams(params: GetJenkinsInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}/updates`);
  }
}
