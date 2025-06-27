import { CreateOrUpdateEnvironmentVariableCommand } from '../../../../../src/clients/api/commands/environment/create-or-update-environment-variable-command.js';
import { DeleteEnvironmentVariableCommand } from '../../../../../src/clients/api/commands/environment/delete-environment-variable-command.js';
import { GetEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/get-environment-command.js';
import { GetExposedEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/get-exposed-environment-command.js';
import { UpdateEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/update-environment-command.js';
import { UpdateExposedEnvironmentCommand } from '../../../../../src/clients/api/commands/environment/update-exposed-environment-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('environment-command', function () {
  this.timeout(10000);
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await Promise.all([support.deleteApplications(), support.deleteAddons()]);
  });

  it('app environment', async () => {
    const application = await support.createTestApplication();

    const initialEnvironment = await support.client.send(new GetEnvironmentCommand({ applicationId: application.id }));
    console.log(initialEnvironment);
    console.log(
      await support.client.send(
        new GetEnvironmentCommand({
          applicationId: application.id,
          includeLinkedAddons: true,
          includeLinkedApplications: true,
        }),
      ),
    );

    console.log(
      await support.client.send(
        new CreateOrUpdateEnvironmentVariableCommand({
          applicationId: application.id,
          name: 'MY_NEW_VAR',
          value: 'my-new-value',
        }),
      ),
    );

    console.log(await support.client.send(new GetEnvironmentCommand({ applicationId: application.id })));

    console.log(
      await support.client.send(
        new CreateOrUpdateEnvironmentVariableCommand({
          applicationId: application.id,
          name: 'MY_NEW_VAR',
          value: 'my-updated-value',
        }),
      ),
    );

    console.log(await support.client.send(new GetEnvironmentCommand({ applicationId: application.id })));

    console.log(
      await support.client.send(
        new DeleteEnvironmentVariableCommand({
          applicationId: application.id,
          name: 'MY_NEW_VAR',
        }),
      ),
    );

    console.log(await support.client.send(new GetEnvironmentCommand({ applicationId: application.id })));

    console.log(
      await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'MY_VAR_1', value: 'hello' },
            { name: 'MY_VAR_2', value: 'world' },
          ],
        }),
      ),
    );

    console.log(await support.client.send(new GetEnvironmentCommand({ applicationId: application.id })));

    console.log(
      await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: initialEnvironment.environment,
        }),
      ),
    );

    console.log(await support.client.send(new GetEnvironmentCommand({ applicationId: application.id })));
  });

  it('addon environment', async () => {
    const addon = await support.createTestAddon();

    console.log(await support.client.send(new GetEnvironmentCommand({ addonId: addon.id })));
  });

  it('exposed environment', async () => {
    const application = await support.createTestApplication();

    const initialEnvironment = await support.client.send(
      new GetExposedEnvironmentCommand({ applicationId: application.id }),
    );
    console.log(initialEnvironment);

    console.log(
      await support.client.send(
        new UpdateExposedEnvironmentCommand({
          applicationId: application.id,
          environment: [{ name: 'test', value: 'test' }],
        }),
      ),
    );

    console.log(await support.client.send(new GetExposedEnvironmentCommand({ applicationId: application.id })));

    console.log(
      await support.client.send(
        new UpdateExposedEnvironmentCommand({
          applicationId: application.id,
          environment: initialEnvironment,
        }),
      ),
    );

    console.log(await support.client.send(new GetExposedEnvironmentCommand({ applicationId: application.id })));
  });
});
