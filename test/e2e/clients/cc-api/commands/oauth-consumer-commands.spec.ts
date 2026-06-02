/**
 * @import { EmailNotificationTarget, WebhookNotificationUrl } from '../../../../../src/clients/cc-api/commands/notification/notification.types.js'
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DeleteOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/delete-oauth-consumer-command.js';
import { GetOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/get-oauth-consumer-command.js';
import { ListOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/list-oauth-consumer-command.js';
import { UpdateOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/update-oauth-consumer-command.js';
import { omit } from '../../../../../src/lib/utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('oauth consumers commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteConsumers();
  });

  it('should create oauth consumer', async () => {
    const response = await support.createTestOauthConsumer();
    expect(response.key).toBeTypeOf('string');
    expect(response.name).toBe('test-consumer');
    expect(response.description).toBe('test consumer description');
    expect(response.url).toBe('https://example.com');
    expect(response.picture).toBe('https://example.com');
    expect(response.baseUrl).toBe('https://example.com');
    expect(response.rights).toEqual({
      accessOrganisations: true,
      accessOrganisationsBills: false,
      accessOrganisationsConsumptionStatistics: false,
      accessOrganisationsCreditCount: true,
      accessPersonalInformation: true,
      almighty: false,
      manageOrganisations: true,
      manageOrganisationsApplications: false,
      manageOrganisationsMembers: true,
      manageOrganisationsServices: true,
      managePersonalInformation: false,
      manageSshKeys: true,
    });
  });

  it('should delete oauth consumer', async () => {
    const consumer = await support.createTestOauthConsumer();

    const response = await support.client.send(new DeleteOauthConsumerCommand({ oauthConsumerKey: consumer.key }));

    expect(response).toBeNull();
  });

  it('should update oauth consumer', async () => {
    const consumer = await support.createTestOauthConsumer();

    const response = await support.client.send(
      new UpdateOauthConsumerCommand({
        oauthConsumerKey: consumer.key,
        ...omit(consumer, 'key'),
        description: 'updated description',
      }),
    );

    expect(response.key).toBe(consumer.key);
    expect(response.name).toBe('test-consumer');
    expect(response.description).toBe('updated description');
    expect(response.url).toBe('https://example.com');
    expect(response.picture).toBe('https://example.com');
    expect(response.baseUrl).toBe('https://example.com');
    expect(response.rights).toEqual({
      accessOrganisations: true,
      accessOrganisationsBills: false,
      accessOrganisationsConsumptionStatistics: false,
      accessOrganisationsCreditCount: true,
      accessPersonalInformation: true,
      almighty: false,
      manageOrganisations: true,
      manageOrganisationsApplications: false,
      manageOrganisationsMembers: true,
      manageOrganisationsServices: true,
      managePersonalInformation: false,
      manageSshKeys: true,
    });
  });

  it('should get oauth consumer with secret', async () => {
    const consumer = await support.createTestOauthConsumer();

    const response = await support.client.send(
      new GetOauthConsumerCommand({
        oauthConsumerKey: consumer.key,
        withSecret: true,
      }),
    );

    expect(response.key).toBe(consumer.key);
    expect(response.name).toBe('test-consumer');
    expect(response.description).toBe('test consumer description');
    expect(response.url).toBe('https://example.com');
    expect(response.picture).toBe('https://example.com');
    expect(response.baseUrl).toBe('https://example.com');
    expect(response.secret).toBeTypeOf('string');
    expect(response.rights).toEqual({
      accessOrganisations: true,
      accessOrganisationsBills: false,
      accessOrganisationsConsumptionStatistics: false,
      accessOrganisationsCreditCount: true,
      accessPersonalInformation: true,
      almighty: false,
      manageOrganisations: true,
      manageOrganisationsApplications: false,
      manageOrganisationsMembers: true,
      manageOrganisationsServices: true,
      managePersonalInformation: false,
      manageSshKeys: true,
    });
  });

  it('should get oauth consumer without secret', async () => {
    const consumer = await support.createTestOauthConsumer();

    const response = await support.client.send(
      new GetOauthConsumerCommand({
        oauthConsumerKey: consumer.key,
        withSecret: false,
      }),
    );

    expect(response.key).toBe(consumer.key);
    expect(response.name).toBe('test-consumer');
    expect(response.description).toBe('test consumer description');
    expect(response.url).toBe('https://example.com');
    expect(response.picture).toBe('https://example.com');
    expect(response.baseUrl).toBe('https://example.com');
    expect(response.secret).toBeUndefined();
    expect(response.rights).toEqual({
      accessOrganisations: true,
      accessOrganisationsBills: false,
      accessOrganisationsConsumptionStatistics: false,
      accessOrganisationsCreditCount: true,
      accessPersonalInformation: true,
      almighty: false,
      manageOrganisations: true,
      manageOrganisationsApplications: false,
      manageOrganisationsMembers: true,
      manageOrganisationsServices: true,
      managePersonalInformation: false,
      manageSshKeys: true,
    });
  });

  it('should list oauth consumers with secret', async () => {
    const consumer1 = await support.createTestOauthConsumer();
    const consumer2 = await support.createTestOauthConsumer();

    const response = await support.client.send(
      new ListOauthConsumerCommand({
        ownerId: support.organisationId,
        withSecret: true,
      }),
    );

    expect(response).toHaveLength(2);
    expect(response.map((c) => c.key)).toEqualInAnyOrder([consumer1.key, consumer2.key]);
    expect(response[0].secret).toBeTypeOf('string');
    expect(response[1].secret).toBeTypeOf('string');
  });

  it('should list oauth consumers without secret', async () => {
    const consumer1 = await support.createTestOauthConsumer();
    const consumer2 = await support.createTestOauthConsumer();

    const response = await support.client.send(
      new ListOauthConsumerCommand({
        ownerId: support.organisationId,
        withSecret: false,
      }),
    );

    expect(response).toHaveLength(2);
    expect(response.map((c) => c.key)).toEqualInAnyOrder([consumer1.key, consumer2.key]);
    expect(response[0].secret).toBeUndefined();
    expect(response[1].secret).toBeUndefined();
  });
});
