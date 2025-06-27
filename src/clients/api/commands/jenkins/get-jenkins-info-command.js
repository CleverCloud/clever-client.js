/**
 * @import { GetJenkinsInfoCommandInput, GetJenkinsInfoCommandOutput, InternalGetJenkinsInfoCommandOutput, GetJenkinsUpdatesCommandOutput } from './get-jenkins-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl } from '../../../../lib/utils.js';
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

    // todo: handle nulls
  }

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetJenkinsInfoCommandInput, InternalGetJenkinsInfoCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX
 * @group Jenkins
 * @version 4
 */
class InternalGetJenkinsInfoCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, InternalGetJenkinsInfoCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, InternalGetJenkinsInfoCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      applicationId: response.app_id,
      plan: response.plan,
      zone: response.zone,
      creationDate: normalizeDate(response.creation_date),
      status: response.status,
      deletionDate: normalizeDate(response.deletion_date),
      host: response.host,
      user: response.user,
      password: response.password,
      version: response.version,
      artifactoryUrl: response.artifactory_url,
      artifactoryUser: response.artifactory_user,
      artifactoryPassword: response.artifactory_password,
      features: response.features,
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
class GetJenkinsUpdatesCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsUpdatesCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}/updates`);
  }
}
