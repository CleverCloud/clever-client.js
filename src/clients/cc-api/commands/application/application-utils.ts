import type { Composer } from '../../../../types/command.types.ts';
import type { CcApiType } from '../../types/cc-api.types.ts';
import type { Application } from './application.types.ts';
import { GetApplicationBranchesCommand } from './get-application-branches-command.ts';

export async function consolidateApplicationWithBranches(
  application: Application,
  composer: Composer<CcApiType>,
): Promise<void> {
  let branches = ['master'];

  if (application.oauthApp?.type === 'github') {
    branches = await composer.send(
      new GetApplicationBranchesCommand({
        ownerId: application.ownerId,
        applicationId: application.id,
      }),
    );
  }
  application.branches = branches;
}
