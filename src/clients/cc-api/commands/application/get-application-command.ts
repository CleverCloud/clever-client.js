import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';
import type { GetApplicationCommandInput, GetApplicationCommandOutput } from './get-application-command.types.js';

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX/branches
 * @group Application
 * @version 2
 */
export class GetApplicationCommand extends CcApiCompositeCommand<
  GetApplicationCommandInput,
  GetApplicationCommandOutput
> {
  async compose(params: GetApplicationCommandInput, composer: CcApiComposer): Promise<GetApplicationCommandOutput> {
    const application = await composer.send(new GetApplicationInnerCommand(params));

    if (application == null) {
      return undefined;
    }
    if (params.withBranches === true) {
      await consolidateApplicationWithBranches(application, composer);
    }
    return application;
  }
}

/**
 * @endpoint [GET] /v2/organisations/:XXX/applications/:XXX
 * @group Application
 * @version 2
 */
export class GetApplicationInnerCommand extends CcApiSimpleCommand<
  GetApplicationCommandInput,
  GetApplicationCommandOutput
> {
  toRequestParams(params: GetApplicationCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications/${params.applicationId}`);
  }

  getEmptyResponsePolicy(status: number) {
    return { isEmpty: status === 404 };
  }

  transformCommandOutput(response: unknown): GetApplicationCommandOutput {
    return transformApplication(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }
}
