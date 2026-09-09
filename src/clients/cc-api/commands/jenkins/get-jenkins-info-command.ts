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
import { transformJenkinsInfo, transformJenkinsUpdates } from './jenkins-transform.js';

/**
 * Retrieves a Jenkins add-on, with the credentials to reach it and its update state.
 *
 * The instance and its update state live behind two endpoints, fetched in parallel and merged.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves a Jenkins add-on, without its update state.
 *
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

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Reads whether a newer Jenkins is available for an add-on.
 *
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX/updates
 * @group Jenkins
 * @version 4
 */
class GetJenkinsUpdatesCommand extends CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsUpdatesCommandOutput> {
  toRequestParams(params: GetJenkinsInfoCommandInput) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}/updates`);
  }

  transformCommandOutput(response: unknown): GetJenkinsUpdatesCommandOutput {
    return transformJenkinsUpdates(response);
  }

  // the add-on version is compared against the Jenkins update centre, which is only read
  isIdempotent(): boolean {
    return true;
  }
}
