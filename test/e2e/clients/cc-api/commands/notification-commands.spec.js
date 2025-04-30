/**
 * @import { EmailNotificationTarget, WebhookNotificationUrl } from '../../../../../src/clients/cc-api/commands/notification/notification.types.js'
 */
import { expect } from 'chai';
import { CreateEmailNotificationCommand } from '../../../../../src/clients/cc-api/commands/notification/create-email-notification-command.js';
import { CreateWebhookNotificationCommand } from '../../../../../src/clients/cc-api/commands/notification/create-webhook-notification-command.js';
import { DeleteEmailNotificationCommand } from '../../../../../src/clients/cc-api/commands/notification/delete-email-notification-command.js';
import { DeleteWebhookNotificationCommand } from '../../../../../src/clients/cc-api/commands/notification/delete-webhook-notification-command.js';
import { GetNotificationInfoCommand } from '../../../../../src/clients/cc-api/commands/notification/get-notification-info-command.js';
import { ListEmailNotificationCommand } from '../../../../../src/clients/cc-api/commands/notification/list-email-notification-command.js';
import { ListWebhookNotificationCommand } from '../../../../../src/clients/cc-api/commands/notification/list-webhook-notification-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('notification commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    const webhookNotifications = await support.client.send(
      new ListWebhookNotificationCommand({ ownerId: support.organisationId }),
    );
    const emailNotifications = await support.client.send(
      new ListEmailNotificationCommand({ ownerId: support.organisationId }),
    );
    await Promise.all([
      ...webhookNotifications.map((n) =>
        support.client.send(
          new DeleteWebhookNotificationCommand({ ownerId: support.organisationId, webhookNotificationId: n.id }),
        ),
      ),
      ...emailNotifications.map((n) =>
        support.client.send(
          new DeleteEmailNotificationCommand({ ownerId: support.organisationId, emailNotificationId: n.id }),
        ),
      ),
    ]);
  });

  it('should create email notification', async () => {
    const app1 = await support.createTestApplication();
    const app2 = await support.createTestApplication();

    /** @type {Array<EmailNotificationTarget>} */
    const targets = [
      {
        type: 'email',
        emailAddresses: ['test1@example.com', 'test2@example.com'],
      },
      {
        type: 'user',
      },
      {
        type: 'organisation',
      },
    ];
    const response = await support.client.send(
      new CreateEmailNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook name',
        targets,
        events: ['META_DEPLOYMENT_RESULT', 'ACCOUNT_CREATION'],
        scope: [app1.id, app2.id],
      }),
    );

    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.name).to.equal('hook name');
    expect(response.targets).to.deep.equalInAnyOrder(targets);
    expect(response.events).to.deep.equalInAnyOrder(['META_DEPLOYMENT_RESULT', 'ACCOUNT_CREATION']);
    expect(response.scope).to.deep.equalInAnyOrder([app1.id, app2.id]);
  });

  it('should list email notifications', async () => {
    const notification1 = await support.client.send(
      new CreateEmailNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook 1',
        targets: [{ type: 'user' }],
      }),
    );
    const notification2 = await support.client.send(
      new CreateEmailNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook 2',
        targets: [{ type: 'user' }],
      }),
    );

    const response = await support.client.send(
      new ListEmailNotificationCommand({
        ownerId: support.organisationId,
      }),
    );

    expect(response).to.have.lengthOf(2);
    expect(response[0].id).to.equal(notification1.id);
    expect(response[0].name).to.equal(notification1.name);
    expect(response[1].id).to.equal(notification2.id);
    expect(response[1].name).to.equal(notification2.name);
  });

  it('should delete email notification', async () => {
    const notification = await support.client.send(
      new CreateEmailNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook 1',
        targets: [{ type: 'user' }],
      }),
    );

    const response = await support.client.send(
      new DeleteEmailNotificationCommand({
        ownerId: support.organisationId,
        emailNotificationId: notification.id,
      }),
    );

    expect(response).to.be.null;
  });

  it('should create webhook notification', async () => {
    /** @type {Array<WebhookNotificationUrl>} */
    const urls = [
      {
        format: 'raw',
        url: 'https://example.com',
      },
      {
        format: 'flowdock',
        url: 'https://example.com',
      },
      {
        format: 'gitter',
        url: 'https://example.com',
      },
      {
        format: 'slack',
        url: 'https://example.com',
      },
    ];
    const app1 = await support.createTestApplication();
    const app2 = await support.createTestApplication();

    const response = await support.client.send(
      new CreateWebhookNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook name',
        urls,
        events: ['META_DEPLOYMENT_RESULT', 'ACCOUNT_CREATION'],
        scope: [app1.id, app2.id],
      }),
    );

    expect(response.ownerId).to.equal(support.organisationId);
    expect(response.name).to.equal('hook name');
    expect(response.urls).to.deep.equalInAnyOrder(urls);
    expect(response.events).to.deep.equalInAnyOrder(['META_DEPLOYMENT_RESULT', 'ACCOUNT_CREATION']);
    expect(response.scope).to.deep.equalInAnyOrder([app1.id, app2.id]);
  });

  it('should list webhook notifications', async () => {
    const notification1 = await support.client.send(
      new CreateWebhookNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook 1',
        urls: [{ format: 'raw', url: 'https://example.com' }],
      }),
    );
    const notification2 = await support.client.send(
      new CreateWebhookNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook 2',
        urls: [{ format: 'raw', url: 'https://example.com' }],
      }),
    );

    const response = await support.client.send(
      new ListWebhookNotificationCommand({
        ownerId: support.organisationId,
      }),
    );

    expect(response).to.have.lengthOf(2);
    expect(response[0].id).to.equal(notification1.id);
    expect(response[0].name).to.equal(notification1.name);
    expect(response[1].id).to.equal(notification2.id);
    expect(response[1].name).to.equal(notification2.name);
  });

  it('should delete webhook notification', async () => {
    const notification = await support.client.send(
      new CreateWebhookNotificationCommand({
        ownerId: support.organisationId,
        name: 'hook 1',
        urls: [{ format: 'raw', url: 'https://example.com' }],
      }),
    );

    const response = await support.client.send(
      new DeleteWebhookNotificationCommand({
        ownerId: support.organisationId,
        webhookNotificationId: notification.id,
      }),
    );

    expect(response).to.be.null;
  });

  it('should get notification info', async () => {
    const response = await support.client.send(new GetNotificationInfoCommand());

    expect(response.formats).to.have.length.greaterThan(0);
    expect(response.events).to.have.length.greaterThan(0);
    expect(Object.entries(response.metaEvents)).to.have.length.greaterThan(0);
  });
});
