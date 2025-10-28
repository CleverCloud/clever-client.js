/**
 * @import { EmailNotificationTarget, WebhookNotificationUrl } from '../../../../../src/clients/cc-api/commands/notification/notification.types.js'
 */
import { expect } from 'chai';
import { AddOrganisationMemberCommand } from '../../../../../src/clients/cc-api/commands/organisation/add-organisation-member-command.js';
import { DeleteOrganisationCommand } from '../../../../../src/clients/cc-api/commands/organisation/delete-organisation-command.js';
import { GetOrganisationCommand } from '../../../../../src/clients/cc-api/commands/organisation/get-organisation-command.js';
import { ListOrganisationCommand } from '../../../../../src/clients/cc-api/commands/organisation/list-organisation-command.js';
import { ListOrganisationMemberCommand } from '../../../../../src/clients/cc-api/commands/organisation/list-organisation-member-command.js';
import { UpdateOrganisationAvatarCommand } from '../../../../../src/clients/cc-api/commands/organisation/update-organisation-avatar-command.js';
import { UpdateOrganisationCommand } from '../../../../../src/clients/cc-api/commands/organisation/update-organisation-command.js';
import { UpdateOrganisationMemberCommand } from '../../../../../src/clients/cc-api/commands/organisation/update-organisation-member-command.js';
import { omit } from '../../../../../src/lib/utils.js';
import { e2eSupport } from '../e2e-support.js';

describe('organisation commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteOrganisations();
  });

  it('should create organisation', async () => {
    const response = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });

    expect(response.id).to.be.a('string');
    expect(response.id).to.match(/^orga_.+/);
    expect(response.name).to.equal('name');
    expect(response.description).to.equal('description');
    expect(response).to.ownProperty('billingEmailAddress');
    expect(response.address).to.equal('address');
    expect(response.city).to.equal('city');
    expect(response.zipcode).to.equal('zipcode');
    expect(response.country).to.equal('FRANCE');
    expect(response).to.ownProperty('company');
    expect(response).to.ownProperty('VAT');
    expect(response).to.ownProperty('avatar');
    expect(response.vatState).to.be.a('string');
    expect(response.customerFullName).to.be.a('string');
    expect(response.customerFullName).to.equal('customerFullName');
    expect(response.canPay).to.be.a('boolean');
    expect(response.cleverEnterprise).to.be.a('boolean');
    expect(response).to.ownProperty('emergencyNumber');
    expect(response.canSEPA).to.be.a('boolean');
    expect(response.isTrusted).to.be.a('boolean');
  });

  it('should delete organisation', async () => {
    const organisation = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });

    const response = await support.client.send(new DeleteOrganisationCommand({ organisationId: organisation.id }));

    expect(response).to.be.null;
  });

  it('should update organisation', async () => {
    const organisation = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });

    const response = await support.client.send(
      new UpdateOrganisationCommand({
        organisationId: organisation.id,
        ...omit(organisation, 'id'),
        description: 'updated description',
        country: 'FR',
      }),
    );

    expect(response.id).to.equal(organisation.id);
    expect(response.name).to.equal('name');
    expect(response.description).to.equal('updated description');
    expect(response).to.ownProperty('billingEmailAddress');
    expect(response.address).to.equal('address');
    expect(response.city).to.equal('city');
    expect(response.zipcode).to.equal('zipcode');
    expect(response.country).to.equal('FRANCE');
    expect(response).to.ownProperty('company');
    expect(response).to.ownProperty('VAT');
    expect(response).to.ownProperty('avatar');
    expect(response.vatState).to.be.a('string');
    expect(response.customerFullName).to.be.a('string');
    expect(response.customerFullName).to.equal('customerFullName');
    expect(response.canPay).to.be.a('boolean');
    expect(response.cleverEnterprise).to.be.a('boolean');
    expect(response).to.ownProperty('emergencyNumber');
    expect(response.canSEPA).to.be.a('boolean');
    expect(response.isTrusted).to.be.a('boolean');
  });

  it('should get organisation', async () => {
    const organisation = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });

    const response = await support.client.send(
      new GetOrganisationCommand({
        organisationId: organisation.id,
      }),
    );

    expect(response.id).to.equal(organisation.id);
    expect(response.name).to.equal('name');
    expect(response.description).to.equal('description');
    expect(response).to.ownProperty('billingEmailAddress');
    expect(response.address).to.equal('address');
    expect(response.city).to.equal('city');
    expect(response.zipcode).to.equal('zipcode');
    expect(response.country).to.equal('FRANCE');
    expect(response).to.ownProperty('company');
    expect(response).to.ownProperty('VAT');
    expect(response).to.ownProperty('avatar');
    expect(response.vatState).to.be.a('string');
    expect(response.customerFullName).to.be.a('string');
    expect(response.customerFullName).to.equal('customerFullName');
    expect(response.canPay).to.be.a('boolean');
    expect(response.cleverEnterprise).to.be.a('boolean');
    expect(response).to.ownProperty('emergencyNumber');
    expect(response.canSEPA).to.be.a('boolean');
    expect(response.isTrusted).to.be.a('boolean');
  });

  it('should list organisations without personal organisation', async () => {
    const organisation1 = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });
    const organisation2 = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });

    const response = await support.client.send(new ListOrganisationCommand({ withPersonalOrganisation: false }));

    expect(response).to.have.lengthOf(2);
    expect(response.map((r) => r.id)).to.deep.equalInAnyOrder([organisation1.id, organisation2.id]);
  });

  it('should list organisations with personal organisation', async () => {
    const organisation1 = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });
    const organisation2 = await support.createTestOrganisation({
      name: 'name',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });

    const response = await support.client.send(new ListOrganisationCommand({ withPersonalOrganisation: true }));

    expect(response).to.have.lengthOf(3);
    expect(response.map((r) => r.id)).to.deep.equalInAnyOrder([organisation1.id, organisation2.id, support.userId]);
  });

  describe('members', () => {
    it('should list members', async () => {
      const organisation = await support.createTestOrganisation();

      const response = await support.client.send(
        new ListOrganisationMemberCommand({ organisationId: organisation.id }),
      );

      expect(response).to.have.lengthOf(1);
      expect(response[0].id).to.match(/^user_.+/);
      expect(response[0].email).to.be.a('string');
      expect(response[0].name).to.be.a('string');
      expect(response[0].avatar).to.be.a('string');
      expect(response[0].preferredMFA).to.be.a('string');
      expect(response[0].role).to.equal('ADMIN');
    });

    it('should update member', async () => {
      const organisation = await support.createTestOrganisation();
      const members = await support.client.send(new ListOrganisationMemberCommand({ organisationId: organisation.id }));
      const memberId = members[0].id;

      const response = await support.client.send(
        new UpdateOrganisationMemberCommand({ organisationId: organisation.id, memberId }),
      );

      expect(response).to.be.null;
    });

    // cannot be automatised because of rate limiting
    it.skip('should add member', async () => {
      const organisation = await support.createTestOrganisation();

      const response = await support.client.send(
        new AddOrganisationMemberCommand({
          organisationId: organisation.id,
          email: 'frontend-ci@clever-cloud.com',
          role: 'DEVELOPER',
        }),
      );

      expect(response).to.be.null;
    });
  });

  it('should update avatar', async () => {
    const organisation = await support.createTestOrganisation();

    let getImage;
    try {
      getImage = await fetch('/avatar');
    } catch {
      getImage = await fetch('https://www.clever.cloud/app/themes/Starter/assets/img/brand-assets/square-png.png');
    }

    const response = await support.client.send(
      new UpdateOrganisationAvatarCommand({
        organisationId: organisation.id,
        mimeType: 'image/jpeg',
        data: await getImage.blob(),
      }),
    );

    expect(response.url).not.to.be.null;
    new URL(response.url);
  });
});
