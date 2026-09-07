import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { AddOrganisationMemberCommand } from '../../../../../src/clients/cc-api/commands/organisation/add-organisation-member-command.js';
import { DeleteOrganisationCommand } from '../../../../../src/clients/cc-api/commands/organisation/delete-organisation-command.js';
import { GetOrganisationCommand } from '../../../../../src/clients/cc-api/commands/organisation/get-organisation-command.js';
import { GetOrganisationSummaryCommand } from '../../../../../src/clients/cc-api/commands/organisation/get-organisation-summary-command.js';
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
    expect(response).toHaveProperty('vat');
    expect(response).toHaveProperty('avatar');
    expect(response.vatState).toBeTypeOf('string');
    expect(response.customerFullName).toBeTypeOf('string');
    expect(response.customerFullName).toBe('customerFullName');
    expect(response.canPay).toBeTypeOf('boolean');
    expect(response.isPremium).toBeTypeOf('boolean');
    expect(response).toHaveProperty('emergencyNumber');
    expect(response.canPayWithSepa).toBeTypeOf('boolean');
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

    expect(response).toBeUndefined();
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
    expect(response).toHaveProperty('vat');
    expect(response).toHaveProperty('avatar');
    expect(response.vatState).toBeTypeOf('string');
    expect(response.customerFullName).toBeTypeOf('string');
    expect(response.customerFullName).toBe('customerFullName');
    expect(response.canPay).toBeTypeOf('boolean');
    expect(response.isPremium).toBeTypeOf('boolean');
    expect(response).toHaveProperty('emergencyNumber');
    expect(response.canPayWithSepa).toBeTypeOf('boolean');
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
    expect(response).toHaveProperty('vat');
    expect(response).toHaveProperty('avatar');
    expect(response.vatState).toBeTypeOf('string');
    expect(response.customerFullName).toBeTypeOf('string');
    expect(response.customerFullName).toBe('customerFullName');
    expect(response.canPay).toBeTypeOf('boolean');
    expect(response.isPremium).toBeTypeOf('boolean');
    expect(response).toHaveProperty('emergencyNumber');
    expect(response.canPayWithSepa).toBeTypeOf('boolean');
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

  it('should get summaries', async () => {
    const organisationB = await support.createTestOrganisation({
      name: 'summary-b',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });
    const organisationA = await support.createTestOrganisation({
      name: 'summary-a',
      description: 'description',
      address: 'address',
      city: 'city',
      zipcode: 'zipcode',
      customerFullName: 'customerFullName',
      country: 'FR',
    });
    // the personal organisation owns it: the endpoint sends it on the user, not on the organisation
    const consumer = await support.createTestOauthConsumer();

    const response = await support.client.send(new GetOrganisationSummaryCommand());

    expect(response.user.id).toBe(support.userId);
    expect(response.user.name).toBeTypeOf('string');
    expect(response.user.avatar).toBeTypeOf('string');
    expect(response.user.emailAddress).toBe(support.email);
    expect(response.user.language).not.toBeNull();
    expect(response.user.isAdmin).toBeTypeOf('boolean');
    expect(response.user.partnerId).toBeTypeOf('string');
    expect(response.user.partnerName).toBeTypeOf('string');
    expect(response.user.partnerConsoleUrl).toBeTypeOf('string');
    expect(response.user.contextFlags).toBeInstanceOf(Array);

    // the personal organisation comes first, the others follow sorted by name
    expect(response.organisations.map((organisation) => organisation.id)).toEqual([
      support.userId,
      organisationA.id,
      organisationB.id,
    ]);

    const personalOrganisation = response.organisations[0];
    expect(personalOrganisation.isPersonal).toBe(true);
    expect(personalOrganisation).not.toHaveProperty('providers');
    expect(personalOrganisation.name).toBeTypeOf('string');
    expect(personalOrganisation.avatar).toBeTypeOf('string');
    expect(personalOrganisation.role).toBe('ADMIN');
    expect(personalOrganisation.vatState).toBeTypeOf('string');
    expect(personalOrganisation.canPay).toBeTypeOf('boolean');
    expect(personalOrganisation.canPayWithSepa).toBeTypeOf('boolean');
    expect(personalOrganisation.isPremium).toBeTypeOf('boolean');
    expect(personalOrganisation).toHaveProperty('emergencyNumber');
    expect(personalOrganisation.isTrusted).toBeTypeOf('boolean');
    expect(personalOrganisation.contextFlags).toBeInstanceOf(Array);
    expect(personalOrganisation.applications).toBeInstanceOf(Array);
    expect(personalOrganisation.addons).toBeInstanceOf(Array);
    expect(personalOrganisation.consumers.map((c) => c.key)).toContain(consumer.key);

    const standardOrganisations = response.organisations.filter((organisation) => !organisation.isPersonal);
    expect(standardOrganisations[0].name).toBe('summary-a');
    expect(standardOrganisations[0].providers).toEqual([]);
    expect(standardOrganisations[0].applications).toEqual([]);
    expect(standardOrganisations[0].addons).toEqual([]);
    expect(standardOrganisations[0].consumers).toEqual([]);
    expect(standardOrganisations[0].role).toBe('ADMIN');
    expect(standardOrganisations[0].vatState).toBeTypeOf('string');
    expect(standardOrganisations[0].canPay).toBeTypeOf('boolean');
    expect(standardOrganisations[0].canPayWithSepa).toBeTypeOf('boolean');
    expect(standardOrganisations[0].isPremium).toBeTypeOf('boolean');
    expect(standardOrganisations[0]).toHaveProperty('emergencyNumber');
    expect(standardOrganisations[0].isTrusted).toBeTypeOf('boolean');
    expect(standardOrganisations[0].contextFlags).toBeInstanceOf(Array);

    await support.deleteConsumers();
  });

  describe('members', () => {
    it('should list members', async () => {
      const organisation = await support.createTestOrganisation();

      const response = await support.client.send(
        new ListOrganisationMemberCommand({ organisationId: organisation.id }),
      );

      expect(response).toHaveLength(1);
      expect(response[0].id).toMatch(/^user_.+/);
      expect(response[0].emailAddress).toBeTypeOf('string');
      expect(response[0].name).toBeTypeOf('string');
      expect(response[0].avatar).toBeTypeOf('string');
      expect(response[0].preferredMfa).toBeTypeOf('string');
      expect(response[0].role).toBe('ADMIN');
    });

    it('should update member', async () => {
      const organisation = await support.createTestOrganisation();
      const members = await support.client.send(new ListOrganisationMemberCommand({ organisationId: organisation.id }));
      const memberId = members[0].id;

      const response = await support.client.send(
        new UpdateOrganisationMemberCommand({ organisationId: organisation.id, memberId }),
      );

      expect(response).toBeUndefined();
    });

    // cannot be automatised because of rate limiting
    it.skip('should add member', async () => {
      const organisation = await support.createTestOrganisation();

      const response = await support.client.send(
        new AddOrganisationMemberCommand({
          organisationId: organisation.id,
          emailAddress: 'frontend-ci@clever-cloud.com',
          role: 'DEVELOPER',
        }),
      );

      expect(response).toBeUndefined();
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
