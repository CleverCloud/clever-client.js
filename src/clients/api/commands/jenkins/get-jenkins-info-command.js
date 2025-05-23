/**
 * @import { GetJenkinsInfoCommandInput, GetJenkinsInfoCommandOutput, InternalGetJenkinsInfoCommandOutput, GetJenkinsUpdatesCommandOutput } from './get-jenkins-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { omit, safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';

/**
 *
 * @extends {CcApiCompositeCommand<GetJenkinsInfoCommandInput, GetJenkinsInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX/updates
 * @group Jenkins
 * @version 4
 */
export class GetJenkinsInfoCommand extends CcApiCompositeCommand {
  /** @type {CcApiCompositeCommand<GetJenkinsInfoCommandInput, GetJenkinsInfoCommandOutput>['compose']} */
  async compose(params, composer) {
    return Promise.all([
      composer.send(new InternalGetJenkinsInfoCommand(params)),
      composer.send(new GetJenkinsUpdatesCommand(params)),
    ]).then(([internal, updates]) => ({
      ...internal,
      updates,
    }));
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetJenkinsInfoCommandInput, InternalGetJenkinsInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX
 * @group Jenkins
 * @version 4
 */
export class InternalGetJenkinsInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, InternalGetJenkinsInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, InternalGetJenkinsInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    // @ts-ignore
    return {
      ...omit(
        response,
        'app_id',
        'owner_id',
        'creation_date',
        'deletion_date',
        'artifactory_url',
        'artifactory_user',
        'artifactory_password',
      ),
      appId: response.app_id,
      ownerId: response.owner_id,
      creationDate: response.creation_date,
      deletionDate: response.deletion_date,
      artifactoryUrl: response.artifactory_url,
      artifactoryUser: response.artifactory_user,
      artifactoryPassword: response.artifactory_password,
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsUpdatesCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX/updates
 * @group Jenkins
 * @version 4
 */
export class GetJenkinsUpdatesCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsUpdatesCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}/updates`);
  }
}
