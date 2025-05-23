import { CreateOrUpdateEnvironmentVariableCommand } from '../../../../../src/clients/api/commands/environment/create-or-update-environment-variable-command.js';
import { DeleteEnvironmentVariableCommand } from '../../../../../src/clients/api/commands/environment/delete-environment-variable-command.js';
import { GetEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/get-environment-command.js';
import { GetExposedEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/get-exposed-environment-command.js';
import { UpdateEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/update-environment-command.js';
import { UpdateExposedEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/update-exposed-environment-command.js';
import { getCcApiClient } from '../../../../lib/cc-api-client.js';

let currentApplicationId = 'app_b75977aa-563f-40fd-a592-224a5f6afbd6';
let currentAddonId = 'addon_1eef66a7-6840-4050-a484-2f7dc14dfded';

describe('environment-command', function () {
  this.timeout(10000);

  it('app environment', async () => {
    const initialEnvironment = await getCcApiClient().send(
      new GetEnvironmentCommand({ applicationId: currentApplicationId }),
    );
    console.log(initialEnvironment);
    console.log(
      await getCcApiClient().send(
        new GetEnvironmentCommand({
          applicationId: currentApplicationId,
          includeLinkedAddons: true,
          includeLinkedApplications: true,
        }),
      ),
    );

    console.log(
      await getCcApiClient().send(
        new CreateOrUpdateEnvironmentVariableCommand({
          applicationId: currentApplicationId,
          name: 'MY_NEW_VAR',
          value: 'my-new-value',
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetEnvironmentCommand({ applicationId: currentApplicationId })));

    console.log(
      await getCcApiClient().send(
        new CreateOrUpdateEnvironmentVariableCommand({
          applicationId: currentApplicationId,
          name: 'MY_NEW_VAR',
          value: 'my-updated-value',
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetEnvironmentCommand({ applicationId: currentApplicationId })));

    console.log(
      await getCcApiClient().send(
        new DeleteEnvironmentVariableCommand({
          applicationId: currentApplicationId,
          name: 'MY_NEW_VAR',
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetEnvironmentCommand({ applicationId: currentApplicationId })));

    console.log(
      await getCcApiClient().send(
        new UpdateEnvironmentCommand({
          applicationId: currentApplicationId,
          environment: [
            { name: 'MY_VAR_1', value: 'hello' },
            { name: 'MY_VAR_2', value: 'world' },
          ],
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetEnvironmentCommand({ applicationId: currentApplicationId })));

    console.log(
      await getCcApiClient().send(
        new UpdateEnvironmentCommand({
          applicationId: currentApplicationId,
          environment: initialEnvironment.environment,
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetEnvironmentCommand({ applicationId: currentApplicationId })));
  });

  it('addon environment', async () => {
    console.log(await getCcApiClient().send(new GetEnvironmentCommand({ addonId: currentAddonId })));
  });

  it('exposed environment', async () => {
    const initialEnvironment = await getCcApiClient().send(
      new GetExposedEnvironmentCommand({ applicationId: currentApplicationId }),
    );
    console.log(initialEnvironment);

    console.log(
      await getCcApiClient().send(
        new UpdateExposedEnvironmentCommand({
          applicationId: currentApplicationId,
          environment: [{ name: 'test', value: 'test' }],
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetExposedEnvironmentCommand({ applicationId: currentApplicationId })));

    console.log(
      await getCcApiClient().send(
        new UpdateExposedEnvironmentCommand({
          applicationId: currentApplicationId,
          environment: initialEnvironment,
        }),
      ),
    );

    console.log(await getCcApiClient().send(new GetExposedEnvironmentCommand({ applicationId: currentApplicationId })));
  });
});
