import { expect } from 'chai';
import { GetLoadBalancerInfoCommand } from '../../../../../src/clients/cc-api/commands/load-balancer/get-load-balancer-info-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('load-balancer commands', function () {
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

  it('should get application load-balancer', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(new GetLoadBalancerInfoCommand({ applicationId: application.id }));

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
    expect(response[0].zoneId).to.be.a('string');
    expect(response[0].dns.cname).to.be.a('string');
    expect(response[0].dns.a).to.be.a('array');
  });

  it('should get private application load-balancer', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new GetLoadBalancerInfoCommand({ applicationId: application.id, kind: 'private' }),
    );

    expect(response).to.be.an('array');
    expect(response).to.have.lengthOf(0);
  });

  it('should get addon load-balancer', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new GetLoadBalancerInfoCommand({ addonId: addon.id }));

    expect(response).to.be.an('array');
    expect(response[0].id).to.be.a('string');
    expect(response[0].zone).to.be.a('string');
    expect(response[0].zoneId).to.be.a('string');
    expect(response[0].dns.cname).to.be.a('string');
    expect(response[0].dns.a).to.be.a('array');
  });
});
