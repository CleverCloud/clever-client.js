import { ListDeploymentCommand } from '../../../../../src/clients/api/commands/deployment/list-deployment-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

let currentApplicationId = 'app_7c6f466c-3314-4753-9e06-f87912f6b856';

describe('deployment-commands', function () {
  this.timeout(10000);

  it('should list all org deployments', async () => {
    const deployments = await getCcApiClient().send(
      new ListDeploymentCommand({
        ownerId: 'orga_540caeb6-521c-4a19-a955-efe6da35d142',
      }),
    );

    console.log(deployments);
  });

  it('should list all app deployments', async () => {
    const deployments = await getCcApiClient().send(
      new ListDeploymentCommand({
        // ownerId: process.env.CC_TEST_OWNER_ID,
        applicationId: currentApplicationId,
        limit: 1,
      }),
    );

    console.log(deployments);
  });
});
