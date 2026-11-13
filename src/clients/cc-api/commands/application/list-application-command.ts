import { get } from '../../../../lib/request/request-params-builder.ts';
import { safeUrl } from '../../../../lib/utils.ts';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { CcApiComposer } from '../../types/cc-api.types.ts';
import { transformApplication } from './application-transform.ts';
import { consolidateApplicationWithBranches } from './application-utils.ts';
import type { ListApplicationCommandInput, ListApplicationCommandOutput } from './list-application-command.types.ts';

/**
 * Lists every application of an organisation, optionally completed with the branches of their
 * deployment repositories.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
export class ListApplicationCommand extends CcApiCompositeCommand<
  ListApplicationCommandInput,
  ListApplicationCommandOutput
> {
  async compose(params: ListApplicationCommandInput, composer: CcApiComposer): Promise<ListApplicationCommandOutput> {
    const applications = await composer.send(new ListApplicationInnerCommand(params));
    if (params.withBranches) {
      await Promise.all(applications.map((application) => consolidateApplicationWithBranches(application, composer)));
    }
    return applications;
  }

  isIdempotent(): boolean {
    return true;
  }
}

/**
 * Lists every application of an organisation, without their branches.
 *
 * @endpoint [GET] /v2/organisations/:XXX/applications
 * @group Application
 * @version 2
 */
export class ListApplicationInnerCommand extends CcApiSimpleCommand<
  ListApplicationCommandInput,
  ListApplicationCommandOutput
> {
  toRequestParams(params: ListApplicationCommandInput) {
    return get(safeUrl`/v2/organisations/${params.ownerId}/applications`);
  }

  transformCommandOutput(response: unknown): ListApplicationCommandOutput {
    return (response as Array<unknown>).map(transformApplication);
  }

  isIdempotent(): boolean {
    return true;
  }
}
