import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetLoadBalancerInfoCommand } from '../../../../../src/clients/cc-api/commands/load-balancer/get-load-balancer-info-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('load-balancer commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await Promise.all([support.deleteApplications(), support.deleteAddons()]);
  });

  it('should get application load-balancer', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(new GetLoadBalancerInfoCommand({ applicationId: application.id }));

    expect(response).toBeInstanceOf(Array);
    expect(response[0].id).toBeTypeOf('string');
    expect(response[0].zone).toBeTypeOf('string');
    expect(response[0].zoneId).toBeTypeOf('string');
    expect(response[0].dns.cname).toBeTypeOf('string');
    expect(response[0].dns.a).toBeInstanceOf(Array);
  });

  it('should get private application load-balancer', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new GetLoadBalancerInfoCommand({ applicationId: application.id, kind: 'private' }),
    );

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(0);
  });

  it('should get addon load-balancer', async () => {
    const addon = await support.createTestAddon();

    const response = await support.client.send(new GetLoadBalancerInfoCommand({ addonId: addon.id }));

    expect(response).toBeInstanceOf(Array);
    expect(response[0].id).toBeTypeOf('string');
    expect(response[0].zone).toBeTypeOf('string');
    expect(response[0].zoneId).toBeTypeOf('string');
    expect(response[0].dns.cname).toBeTypeOf('string');
    expect(response[0].dns.a).toBeInstanceOf(Array);
  });
});
