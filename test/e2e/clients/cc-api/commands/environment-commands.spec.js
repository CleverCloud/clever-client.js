import { expect } from 'chai';
import { UpdateConfigProviderCommand } from '../../../../../src/clients/cc-api/commands/config-provider/update-config-provider-command.js';
import { CreateOrUpdateEnvironmentVariableCommand } from '../../../../../src/clients/cc-api/commands/environment/create-or-update-environment-variable-command.js';
import { DeleteEnvironmentVariableCommand } from '../../../../../src/clients/cc-api/commands/environment/delete-environment-variable-command.js';
import { GetEnvironmentCommand } from '../../../../../src/clients/cc-api/commands/environment/get-environment-command.js';
import { GetExposedEnvironmentCommand } from '../../../../../src/clients/cc-api/commands/environment/get-exposed-environment-command.js';
import { UpdateEnvironmentCommand } from '../../../../../src/clients/cc-api/commands/environment/update-environment-command.js';
import { UpdateExposedEnvironmentCommand } from '../../../../../src/clients/cc-api/commands/environment/update-exposed-environment-command.js';
import { AddLinkCommand } from '../../../../../src/clients/cc-api/commands/link/add-link-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('environment commands', function () {
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

  describe('application environment', () => {
    it('should create or update environment variable', async () => {
      const application = await support.createTestApplication();
      await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'FOO', value: 'bar' },
            { name: 'BAR', value: 'bar' },
          ],
        }),
      );

      const response = await support.client.send(
        new CreateOrUpdateEnvironmentVariableCommand({
          applicationId: application.id,
          name: 'FOO',
          value: 'baz',
        }),
      );

      expect(response).to.deep.equalInAnyOrder([
        { name: 'FOO', value: 'baz' },
        { name: 'BAR', value: 'bar' },
      ]);
    });

    it('should delete environment variable', async () => {
      const application = await support.createTestApplication();
      await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'FOO', value: 'bar' },
            { name: 'BAR', value: 'bar' },
          ],
        }),
      );

      const response = await support.client.send(
        new DeleteEnvironmentVariableCommand({
          applicationId: application.id,
          name: 'FOO',
        }),
      );

      expect(response).to.deep.equalInAnyOrder([{ name: 'BAR', value: 'bar' }]);
    });

    it('should get environment', async () => {
      const application = await support.createTestApplication();
      await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'FOO', value: 'bar' },
            { name: 'BAR', value: 'bar' },
          ],
        }),
      );

      const response = await support.client.send(new GetEnvironmentCommand({ applicationId: application.id }));

      expect(response).to.deep.equalInAnyOrder({
        environment: [
          { name: 'FOO', value: 'bar' },
          { name: 'BAR', value: 'bar' },
        ],
      });
    });

    it('should get environment with linked application and addon', async () => {
      const [application1, application2, addon] = await Promise.all([
        support.createTestApplication(),
        support.createTestApplication(),
        support.createTestAddon(),
      ]);
      await Promise.all([
        support.client.send(
          new UpdateConfigProviderCommand({
            addonId: addon.id,
            environment: [
              { name: 'ADDON_FOO', value: 'addon foo' },
              { name: 'ADDON_BAR', value: 'addon bar' },
            ],
          }),
        ),
        support.client.send(
          new UpdateEnvironmentCommand({
            applicationId: application1.id,
            environment: [
              { name: 'APP1_FOO', value: 'app1 foo' },
              { name: 'APP1_BAR', value: 'app1 bar' },
            ],
          }),
        ),
        support.client.send(
          new UpdateExposedEnvironmentCommand({
            applicationId: application2.id,
            environment: [
              { name: 'APP2_FOO', value: 'app2 foo' },
              { name: 'APP2_BAR', value: 'app2 bar' },
            ],
          }),
        ),
      ]);
      await Promise.all([
        await support.client.send(
          new AddLinkCommand({ applicationId: application1.id, targetApplicationId: application2.id }),
        ),
        await support.client.send(new AddLinkCommand({ applicationId: application1.id, targetAddonId: addon.id })),
      ]);

      const response = await support.client.send(
        new GetEnvironmentCommand({
          applicationId: application1.id,
          includeLinkedAddons: true,
          includeLinkedApplications: true,
        }),
      );

      expect(response).to.deep.equalInAnyOrder({
        environment: [
          { name: 'APP1_FOO', value: 'app1 foo' },
          { name: 'APP1_BAR', value: 'app1 bar' },
        ],
        linkedApplicationsEnvironment: [
          {
            applicationId: application2.id,
            applicationName: application2.name,
            environment: [
              { name: 'APP2_FOO', value: 'app2 foo' },
              { name: 'APP2_BAR', value: 'app2 bar' },
            ],
          },
        ],
        linkedAddonsEnvironment: [
          {
            addonId: addon.id,
            addonName: addon.name,
            addonProviderId: addon.provider.id,
            environment: [
              { name: 'ADDON_FOO', value: 'addon foo' },
              { name: 'ADDON_BAR', value: 'addon bar' },
            ],
          },
        ],
      });
    });

    it('should get exposed environment', async () => {
      const application = await support.createTestApplication();
      await support.client.send(
        new UpdateExposedEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'FOO', value: 'foo' },
            { name: 'BAR', value: 'bar' },
          ],
        }),
      );

      const response = await support.client.send(new GetExposedEnvironmentCommand({ applicationId: application.id }));

      expect(response).to.deep.equalInAnyOrder([
        { name: 'FOO', value: 'foo' },
        { name: 'BAR', value: 'bar' },
      ]);
    });

    it('should update exposed environment', async () => {
      const application = await support.createTestApplication();

      const response = await support.client.send(
        new UpdateExposedEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'FOO', value: 'foo' },
            { name: 'BAR', value: 'bar' },
          ],
        }),
      );

      expect(response).to.be.null;
    });

    it('should update environment', async () => {
      const application = await support.createTestApplication();
      await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: [
            { name: 'FOO', value: 'bar' },
            { name: 'BAR', value: 'bar' },
          ],
        }),
      );

      const response = await support.client.send(
        new UpdateEnvironmentCommand({
          applicationId: application.id,
          environment: [{ name: 'FOO', value: 'FOO BAR' }],
        }),
      );

      expect(response).to.deep.equalInAnyOrder([{ name: 'FOO', value: 'FOO BAR' }]);
    });
  });

  describe('addon environment', () => {
    it('should get environment', async () => {
      const addon = await support.createTestAddon();
      await support.client.send(
        new UpdateConfigProviderCommand({
          addonId: addon.id,
          environment: [
            { name: 'ADDON_FOO', value: 'addon foo' },
            { name: 'ADDON_BAR', value: 'addon bar' },
          ],
        }),
      );

      const response = await support.client.send(new GetEnvironmentCommand({ addonId: addon.id }));

      expect(response).to.deep.equalInAnyOrder({
        environment: [
          { name: 'ADDON_FOO', value: 'addon foo' },
          { name: 'ADDON_BAR', value: 'addon bar' },
        ],
      });
    });
  });
});
