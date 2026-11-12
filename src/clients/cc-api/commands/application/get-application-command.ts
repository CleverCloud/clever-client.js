import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import type { IdResolve } from '../../types/resource-id-resolver.types.ts';
import { transformApplication } from './application-transform.ts';
import { consolidateApplicationWithBranches } from './application-utils.ts';
import type { GetApplicationCommandInput, GetApplicationCommandOutput } from './get-application-command.types.ts';

/**
 * Retrieves an application, optionally completed with the branches of its deployment repository.
 *
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

    if (params.withBranches === true) {
      await consolidateApplicationWithBranches(application, composer);
    }
    return application;
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Retrieves an application, without its branches.
 *
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

  transformCommandOutput(response: unknown): GetApplicationCommandOutput {
    return transformApplication(response);
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
    };
  }

  isIdempotent(): boolean {
    return true;
  }
}
