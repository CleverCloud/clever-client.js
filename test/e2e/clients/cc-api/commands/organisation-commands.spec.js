/**
 * @import { EmailNotificationTarget, WebhookNotificationUrl } from '../../../../../src/clients/cc-api/commands/notification/notification.types.js'
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
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

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
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

    expect(response.id).toBeTypeOf('string');
    expect(response.id).toMatch(/^orga_.+/);
    expect(response.name).toBe('name');
    expect(response.description).toBe('description');
    expect(response).toHaveProperty('billingEmailAddress');
    expect(response.address).toBe('address');
    expect(response.city).toBe('city');
    expect(response.zipcode).toBe('zipcode');
    expect(response.country).toBe('FRANCE');
    expect(response).toHaveProperty('company');
    expect(response).toHaveProperty('VAT');
    expect(response).toHaveProperty('avatar');
    expect(response.vatState).toBeTypeOf('string');
    expect(response.customerFullName).toBeTypeOf('string');
    expect(response.customerFullName).toBe('customerFullName');
    expect(response.canPay).toBeTypeOf('boolean');
    expect(response.cleverEnterprise).toBeTypeOf('boolean');
    expect(response).toHaveProperty('emergencyNumber');
    expect(response.canSEPA).toBeTypeOf('boolean');
    expect(response.isTrusted).toBeTypeOf('boolean');
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

    expect(response).toBeNull();
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

    expect(response.id).toBe(organisation.id);
    expect(response.name).toBe('name');
    expect(response.description).toBe('updated description');
    expect(response).toHaveProperty('billingEmailAddress');
    expect(response.address).toBe('address');
    expect(response.city).toBe('city');
    expect(response.zipcode).toBe('zipcode');
    expect(response.country).toBe('FRANCE');
    expect(response).toHaveProperty('company');
    expect(response).toHaveProperty('VAT');
    expect(response).toHaveProperty('avatar');
    expect(response.vatState).toBeTypeOf('string');
    expect(response.customerFullName).toBeTypeOf('string');
    expect(response.customerFullName).toBe('customerFullName');
    expect(response.canPay).toBeTypeOf('boolean');
    expect(response.cleverEnterprise).toBeTypeOf('boolean');
    expect(response).toHaveProperty('emergencyNumber');
    expect(response.canSEPA).toBeTypeOf('boolean');
    expect(response.isTrusted).toBeTypeOf('boolean');
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

    expect(response.id).toBe(organisation.id);
    expect(response.name).toBe('name');
    expect(response.description).toBe('description');
    expect(response).toHaveProperty('billingEmailAddress');
    expect(response.address).toBe('address');
    expect(response.city).toBe('city');
    expect(response.zipcode).toBe('zipcode');
    expect(response.country).toBe('FRANCE');
    expect(response).toHaveProperty('company');
    expect(response).toHaveProperty('VAT');
    expect(response).toHaveProperty('avatar');
    expect(response.vatState).toBeTypeOf('string');
    expect(response.customerFullName).toBeTypeOf('string');
    expect(response.customerFullName).toBe('customerFullName');
    expect(response.canPay).toBeTypeOf('boolean');
    expect(response.cleverEnterprise).toBeTypeOf('boolean');
    expect(response).toHaveProperty('emergencyNumber');
    expect(response.canSEPA).toBeTypeOf('boolean');
    expect(response.isTrusted).toBeTypeOf('boolean');
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

    expect(response).toHaveLength(2);
    expect(response.map((r) => r.id)).toEqualInAnyOrder([organisation1.id, organisation2.id]);
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

    expect(response).toHaveLength(3);
    expect(response.map((r) => r.id)).toEqualInAnyOrder([organisation1.id, organisation2.id, support.userId]);
  });

  describe('members', () => {
    it('should list members', async () => {
      const organisation = await support.createTestOrganisation();

      const response = await support.client.send(
        new ListOrganisationMemberCommand({ organisationId: organisation.id }),
      );

      expect(response).toHaveLength(1);
      expect(response[0].id).toMatch(/^user_.+/);
      expect(response[0].email).toBeTypeOf('string');
      expect(response[0].name).toBeTypeOf('string');
      expect(response[0].avatar).toBeTypeOf('string');
      expect(response[0].preferredMFA).toBeTypeOf('string');
      expect(response[0].role).toBe('ADMIN');
    });

    it('should update member', async () => {
      const organisation = await support.createTestOrganisation();
      const members = await support.client.send(new ListOrganisationMemberCommand({ organisationId: organisation.id }));
      const memberId = members[0].id;

      const response = await support.client.send(
        new UpdateOrganisationMemberCommand({ organisationId: organisation.id, memberId }),
      );

      expect(response).toBeNull();
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

      expect(response).toBeNull();
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

    expect(response.url).not.toBeNull();
    new URL(response.url);
  });
});
