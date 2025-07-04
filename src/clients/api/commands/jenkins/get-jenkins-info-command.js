/**
 * @import { GetJenkinsInfoCommandInput, GetJenkinsInfoCommandOutput, GetJenkinsInfoInnerCommandOutput, GetJenkinsUpdatesCommandOutput } from './get-jenkins-info-command.types.js';
 */
import { get } from '../../../../lib/request/request-params-builder.js';
import { normalizeDate, safeUrl, sortBy } from '../../../../lib/utils.js';
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

  /** @type {CcApiCompositeCommand<?, ?>['getIdsToResolve']} */
  getIdsToResolve() {
    return {
      addonId: 'REAL_ADDON_ID',
    };
  }
}

/**
 *
 * @extends {CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsInfoInnerCommandOutput>}
 * @endpoint [GET] /v4/addon-providers/jenkins/addons/:XXX
 * @group Jenkins
 * @version 4
 */
class GetJenkinsInfoInnerCommand extends CcApiSimpleCommand {
  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsInfoInnerCommandOutput>['toRequestParams']} */
  toRequestParams(params) {
    return get(safeUrl`/v4/addon-providers/jenkins/addons/${params.addonId}`);
  }

  /** @type {CcApiSimpleCommand<GetJenkinsInfoCommandInput, GetJenkinsInfoInnerCommandOutput>['transformCommandOutput']} */
  transformCommandOutput(response) {
    return {
      id: response.id,
      addonId: response.app_id,
      plan: response.plan,
      zone: response.zone,
      creationDate: normalizeDate(response.creation_date),
      deletionDate: normalizeDate(response.deletion_date),
      status: response.status,
      host: response.host,
      user: response.user,
      password: response.password,
      version: response.version,
      artifactoryUrl: response.artifactory_url,
      artifactoryUser: response.artifactory_user,
      artifactoryPassword: response.artifactory_password,
      features: sortBy(response.features, 'name'),
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
