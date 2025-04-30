import { expect } from 'chai';
import { CreateAddonProviderCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/create-addon-provider-command.js';
import { CreateAddonProviderFeatureCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/create-addon-provider-feature-command.js';
import { CreateAddonProviderPlanCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/create-addon-provider-plan-command.js';
import { DeleteAddonProviderCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/delete-addon-provider-command.js';
import { DeleteAddonProviderFeatureCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/delete-addon-provider-feature-command.js';
import { DeleteAddonProviderPlanCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/delete-addon-provider-plan-command.js';
import { GetAddonProviderCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/get-addon-provider-command.js';
import { ListAddonProviderFeatureCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/list-addon-provider-feature-command.js';
import { ListAddonProviderPlanCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/list-addon-provider-plan-command.js';
import { UpdateAddonProviderCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/update-addon-provider-command.js';
import { UpdateAddonProviderPlanCommand } from '../../../../../src/clients/cc-api/commands/addon-provider/update-addon-provider-plan-command.js';
import { e2eSupport } from '../e2e-support.js';

// cannot be automatised because addon provider deletion doesn't work!
// cannot be automatised because addon provider plan deletion doesn't work!
const addonProvider = {
  id: 'test-addon-provider',
};

describe.skip('addon-provider commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    // await support.deleteAddonProviders();
    //
    // const [plans, features] = await Promise.all([
    //   support.client.send(new ListAddonProviderPlanCommand({ addonProviderId: addonProvider.id })),
    //   support.client.send(new ListAddonProviderFeatureCommand({ addonProviderId: addonProvider.id })),
    // ]);
    // await Promise.all(
    //   plans.map((p) =>
    //     support
    //       .client
    //       .send(new DeleteAddonProviderPlanCommand({ addonProviderId: addonProvider.id, planId: p.id })),
    //   ),
    // );
    // await Promise.all(
    //   features.map((f) =>
    //     support
    //       .client
    //       .send(new DeleteAddonProviderFeatureCommand({ addonProviderId: addonProvider.id, name: f.name })),
    //   ),
    // );
  });

  it('should create addon provider', async () => {
    const response = await support.client.send(
      new CreateAddonProviderCommand({
        ownerId: support.organisationId,
        id: 'test-addon-provider',
        name: 'Test Addon Provider',
        api: {
          configVars: [],
          zones: ['par'],
          password: '354635365qd1rg35q4dfg365qd4fg365qds4g3q65sdg436q5dresg4q365dsg4q365sdg4qs3d56g',
          ssoSalt: 'ze87tgsdv654hj749yu8ks65dc4sqd68gh7retyjn65fdv4sd9fr8juio3l5k213u2j,k4e98dr7gr5',
          production: {
            baseUrl: 'https://example.com/prod/base',
            ssoUrl: 'https://example.com/prod/sso',
          },
          test: {
            baseUrl: 'https://example.com/test/base',
            ssoUrl: 'https://example.com/test/sso',
          },
        },
      }),
    );

    console.log(response);

    expect(response.id).to.deep.equal('test-addon-provider');
    expect(response.name).to.deep.equal('Test Addon Provider');
    expect(response.status).to.deep.equal('ALPHA');
  });

  it('should delete addon provider', async () => {
    const response = await support.client.send(new DeleteAddonProviderCommand({ addonProviderId: addonProvider.id }));

    expect(response).to.be.null;
  });

  it('should update addon provider', async () => {
    const response = await support.client.send(
      new UpdateAddonProviderCommand({
        addonProviderId: addonProvider.id,
        name: 'Test Addon Provider updated',
      }),
    );

    expect(response.id).to.equal(addonProvider.id);
    expect(response.name).to.equal('Test Addon Provider updated');
  });

  it('should get addon provider', async () => {
    const response = await support.client.send(
      new GetAddonProviderCommand({
        addonProviderId: addonProvider.id,
      }),
    );

    console.log(response);

    expect(response.id).to.deep.equal(addonProvider.id);
    expect(response.name).to.deep.equal('Test Addon Provider');
    expect(response.status).to.deep.equal('ALPHA');
  });

  it('should create addon provider feature', async () => {
    const response = await support.client.send(
      new CreateAddonProviderFeatureCommand({
        addonProviderId: addonProvider.id,
        name: 'feature',
        type: 'STRING',
      }),
    );

    expect(response.name).to.equal('feature');
    expect(response.type).to.equal('STRING');
    expect(response.nameCode).to.equal('feature');
  });

  it('should delete addon provider feature', async () => {
    await support.client.send(
      new CreateAddonProviderFeatureCommand({
        addonProviderId: addonProvider.id,
        name: 'feature',
        type: 'STRING',
      }),
    );

    const response = await support.client.send(
      new DeleteAddonProviderFeatureCommand({
        addonProviderId: addonProvider.id,
        name: 'feature',
      }),
    );

    expect(response).to.be.null;
  });

  it('should list addon provider feature', async () => {
    await support.client.send(
      new CreateAddonProviderFeatureCommand({
        addonProviderId: addonProvider.id,
        name: 'feature1',
        type: 'STRING',
      }),
    );
    await support.client.send(
      new CreateAddonProviderFeatureCommand({
        addonProviderId: addonProvider.id,
        name: 'feature2',
        type: 'BOOLEAN',
      }),
    );

    const response = await support.client.send(
      new ListAddonProviderFeatureCommand({ addonProviderId: addonProvider.id }),
    );

    expect(response).to.be.an('array');
    expect(response).to.have.lengthOf(2);
    expect(response[0].name).to.equal('feature1');
    expect(response[0].nameCode).to.equal('feature1');
    expect(response[0].type).to.equal('STRING');
    expect(response[1].name).to.equal('feature2');
    expect(response[1].nameCode).to.equal('feature2');
    expect(response[1].type).to.equal('BOOLEAN');
  });

  it('should create addon provider plan', async () => {
    const response = await support.client.send(
      new CreateAddonProviderPlanCommand({
        addonProviderId: addonProvider.id,
        name: 'plan name 2',
        slug: 'XS',
        price: 42,
      }),
    );

    console.log(response);
    expect(response.id).to.match(/^plan_.+/);
    expect(response.name).to.equal('plan name 2');
    expect(response.price).to.equal(42);
    expect(response.slug).to.equal('XS');
    expect(response.zones).to.be.an('array');
    expect(response.features).to.be.an('array');
  });

  it('should update addon provider plan', async () => {
    const plan = await support.client.send(
      new CreateAddonProviderPlanCommand({
        addonProviderId: addonProvider.id,
        name: 'plan name 2',
        slug: 'XS',
        price: 42,
      }),
    );

    const response = await support.client.send(
      new UpdateAddonProviderPlanCommand({
        addonProviderId: addonProvider.id,
        planId: plan.id,
        name: 'updated name',
        slug: 'XXS',
        price: 54,
      }),
    );

    console.log(response);
    expect(response.id).to.equal(plan.id);
    expect(response.name).to.equal('updated name');
    expect(response.price).to.equal(54);
    expect(response.slug).to.equal('XXS');
    expect(response.zones).to.be.an('array');
    expect(response.features).to.be.an('array');
  });

  it('should list addon provider plans', async () => {
    const plan1 = await support.client.send(
      new CreateAddonProviderPlanCommand({
        addonProviderId: addonProvider.id,
        name: 'plan 1',
        slug: 'XS',
        price: 42,
      }),
    );
    const plan2 = await support.client.send(
      new CreateAddonProviderPlanCommand({
        addonProviderId: addonProvider.id,
        name: 'plan 2',
        slug: 'XS',
        price: 42,
      }),
    );

    const response = await support.client.send(new ListAddonProviderPlanCommand({ addonProviderId: addonProvider.id }));

    console.log(response);
    expect(response).to.be.an('array');
    expect(response).to.have.lengthOf(2);
    expect(response).to.deep.equalInAnyOrder([plan1, plan2]);
  });

  it('should delete addon provider plans', async () => {
    const plan = await support.client.send(
      new CreateAddonProviderPlanCommand({
        addonProviderId: addonProvider.id,
        name: 'plan 1',
        slug: 'XS',
        price: 42,
      }),
    );

    const response = await support.client.send(
      new DeleteAddonProviderPlanCommand({ addonProviderId: addonProvider.id, planId: plan.id }),
    );

    console.log(response);
    expect(response).to.be.null;
  });
});
