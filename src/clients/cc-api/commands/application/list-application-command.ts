import { get } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { transformApplication } from './application-transform.js';
import { consolidateApplicationWithBranches } from './application-utils.js';
import type { ListApplicationCommandInput, ListApplicationCommandOutput } from './list-application-command.types.js';

/**
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
}

/**
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
}
