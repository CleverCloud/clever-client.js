import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ListAddonCreationConfigurationNoticeCommand } from '../../../../../src/clients/cc-api/commands/notice/list-addon-creation-configuration-notice-command.js';
import { ListAddonCreationListNoticeCommand } from '../../../../../src/clients/cc-api/commands/notice/list-addon-creation-list-notice-command.js';
import { ListAddonNoticeCommand } from '../../../../../src/clients/cc-api/commands/notice/list-addon-notice-command.js';
import { ListApplicationNoticeCommand } from '../../../../../src/clients/cc-api/commands/notice/list-application-notice-command.js';
import { ListHomeNoticeCommand } from '../../../../../src/clients/cc-api/commands/notice/list-home-notice-command.js';
import { ListOrganisationNoticeCommand } from '../../../../../src/clients/cc-api/commands/notice/list-organisation-notice-command.js';
import type { Notice } from '../../../../../src/clients/cc-api/commands/notice/notice.types.js';
import { e2eSupport } from '../e2e-support.js';

// The notices shown depend on what operators published, so an empty array is as valid as a full one:
// these tests check the shape of whatever comes back.
function checkNotice(notice: Notice) {
  expect(notice.id).toBeTypeOf('string');
  expect(notice.title).toBeTypeOf('string');
  expect(notice.message).toBeTypeOf('string');
  expect(['info', 'success', 'warning', 'danger']).toContain(notice.intent);
}

describe('notice commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should list home notices', async () => {
    const response = await support.client.send(new ListHomeNoticeCommand());

    expect(response).toBeInstanceOf(Array);
    response.forEach(checkNotice);
  });

  it('should list organisation notices', async () => {
    const response = await support.client.send(new ListOrganisationNoticeCommand({ ownerId: support.organisationId }));

    expect(response).toBeInstanceOf(Array);
    response.forEach(checkNotice);
  });

  it('should list application notices', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(new ListApplicationNoticeCommand({ applicationId: application.id }));

    expect(response).toBeInstanceOf(Array);
    response.forEach(checkNotice);
  });

  it('should list addon notices', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new ListAddonNoticeCommand({ addonId: addon.id }));

    expect(response).toBeInstanceOf(Array);
    response.forEach(checkNotice);
  });

  it('should list addon creation list notices', async () => {
    const response = await support.client.send(
      new ListAddonCreationListNoticeCommand({ ownerId: support.organisationId }),
    );

    expect(response).toBeInstanceOf(Array);
    response.forEach((notice) => {
      checkNotice(notice);
      expect(notice.addonProviderId).not.toBeNull();
    });
  });

  it('should list addon creation configuration notices', async () => {
    const response = await support.client.send(
      new ListAddonCreationConfigurationNoticeCommand({
        ownerId: support.organisationId,
        addonProviderId: 'postgresql-addon',
      }),
    );

    expect(response).toBeInstanceOf(Array);
    response.forEach(checkNotice);
  });
});
