import { expect } from 'chai';
import { ListLogCommand } from '../../../../../src/clients/api/commands/log/list-log-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

const addon = {
  id: 'addon_5b4a7c43-4b84-45e6-837c-153308182bf1',
};

// cannot be completely automatised
describe('log commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  it('should list addon log', async () => {
    // const addon = await support.createTestAddon();

    const response = await support.getClient('DEV').send(
      new ListLogCommand({
        addonId: addon.id,
      }),
    );

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    expect(response[0].date).to.equal(new Date(response[0].date).toISOString());
    expect(response[0].message).to.be.a('string');
    expect(response[0].type).to.be.a('string');
    expect(response[0].severity).to.be.a('string');
    expect(response[0].program).to.be.a('string');
    expect(response[0].deploymentId).to.be.a('string');
    expect(response[0].sourceHost).to.be.a('string');
    expect(response[0].sourceIp).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
  });

  it('should list addon log with options', async () => {
    // const addon = await support.createTestAddon();

    const response = await support.getClient('DEV').send(
      new ListLogCommand({
        addonId: addon.id,
        deploymentId: 'deployment_21a2898d-2884-4eca-9dbb-99714b91d188',
        limit: 10,
        order: 'DESC',
      }),
    );

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    expect(response[0].date).to.equal(new Date(response[0].date).toISOString());
    expect(response[0].message).to.be.a('string');
    expect(response[0].type).to.be.a('string');
    expect(response[0].severity).to.be.a('string');
    expect(response[0].program).to.be.a('string');
    expect(response[0].deploymentId).to.be.a('string');
    expect(response[0].sourceHost).to.be.a('string');
    expect(response[0].sourceIp).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
  });
});
