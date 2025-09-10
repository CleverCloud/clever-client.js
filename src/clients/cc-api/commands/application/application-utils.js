/**
 * @import { Application } from './application.types.js';
 * @import { Composer } from '../../../../types/command.types.js';
 * @import { CcApiType } from '../../types/cc-api.types.js';
 */
import { GetApplicationBranchesCommand } from './get-application-branches-command.js';

/**
 * @param {Application} application
 * @param {Composer<CcApiType>} composer
 */
export async function consolidateApplicationWithBranches(application, composer) {
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
