/**
 * @import { EmailNotificationTarget, WebhookNotificationUrl } from '../../../../../src/clients/cc-api/commands/notification/notification.types.js'
 */
import { expect } from 'chai';
import { DeleteOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/delete-oauth-consumer-command.js';
import { GetOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/get-oauth-consumer-command.js';
import { ListOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/list-oauth-consumer-command.js';
import { UpdateOauthConsumerCommand } from '../../../../../src/clients/cc-api/commands/oauth-consumer/update-oauth-consumer-command.js';
import { omit } from '../../../../../src/lib/utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('oauth consumers commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteConsumers();
  });

  it('should create oauth consumer', async () => {
    const response = await support.createTestOauthConsumer();
    expect(response.key).to.be.a('string');
    expect(response.name).to.equal('test-consumer');
    expect(response.description).to.equal('test consumer description');
    expect(response.url).to.equal('https://example.com');
    expect(response.picture).to.equal('https://example.com');
    expect(response.baseUrl).to.equal('https://example.com');
    expect(response.rights).to.deep.equal({
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

    expect(response).to.be.null;
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

    expect(response.key).to.be.equal(consumer.key);
    expect(response.name).to.equal('test-consumer');
    expect(response.description).to.equal('updated description');
    expect(response.url).to.equal('https://example.com');
    expect(response.picture).to.equal('https://example.com');
    expect(response.baseUrl).to.equal('https://example.com');
    expect(response.rights).to.deep.equal({
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

    expect(response.key).to.be.equal(consumer.key);
    expect(response.name).to.equal('test-consumer');
    expect(response.description).to.equal('test consumer description');
    expect(response.url).to.equal('https://example.com');
    expect(response.picture).to.equal('https://example.com');
    expect(response.baseUrl).to.equal('https://example.com');
    expect(response.secret).to.be.a('string');
    expect(response.rights).to.deep.equal({
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

    expect(response.key).to.be.equal(consumer.key);
    expect(response.name).to.equal('test-consumer');
    expect(response.description).to.equal('test consumer description');
    expect(response.url).to.equal('https://example.com');
    expect(response.picture).to.equal('https://example.com');
    expect(response.baseUrl).to.equal('https://example.com');
    expect(response.secret).to.be.undefined;
    expect(response.rights).to.deep.equal({
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

    expect(response).to.have.lengthOf(2);
    expect(response[0].key).to.equal(consumer1.key);
    expect(response[0].secret).to.be.a('string');
    expect(response[1].key).to.equal(consumer2.key);
    expect(response[1].secret).to.be.a('string');
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

    expect(response).to.have.lengthOf(2);
    expect(response[0].key).to.equal(consumer1.key);
    expect(response[0].secret).to.be.undefined;
    expect(response[1].key).to.equal(consumer2.key);
    expect(response[1].secret).to.be.undefined;
  });
});
