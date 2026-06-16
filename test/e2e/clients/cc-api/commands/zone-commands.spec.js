import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GetZoneCommand } from '../../../../../src/clients/cc-api/commands/zone/get-zone-command.js';
import { ListZoneCommand } from '../../../../../src/clients/cc-api/commands/zone/list-zone-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('zone commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should list all zones', async () => {
    const response = await support.client.send(new ListZoneCommand());

    expect(response[0].id).toBeTypeOf('string');
    expect(response[0].name).toBeTypeOf('string');
    expect(response[0].country).toBeTypeOf('string');
    expect(response[0].countryCode).toBeTypeOf('string');
    expect(response[0].lat).toBeTypeOf('number');
    expect(response[0].lon).toBeTypeOf('number');
    expect(response[0].outboundIPs).toBeInstanceOf(Array);
    expect(response[0].tags).toBeInstanceOf(Array);
  });

  it('should list zones for ownerId', async () => {
    const response = await support.client.send(new ListZoneCommand({ ownerId: support.organisationId }));

    expect(response[0].id).toBeTypeOf('string');
    expect(response[0].name).toBeTypeOf('string');
    expect(response[0].country).toBeTypeOf('string');
    expect(response[0].countryCode).toBeTypeOf('string');
    expect(response[0].lat).toBeTypeOf('number');
    expect(response[0].lon).toBeTypeOf('number');
    expect(response[0].outboundIPs).toBeInstanceOf(Array);
    expect(response[0].tags).toBeInstanceOf(Array);
  });

  it('should get "par" zone by name without ownerId', async () => {
    const response = await support.client.send(new GetZoneCommand({ zoneName: 'par' }));

    expect(response.id).toBeTypeOf('string');
    expect(response.name).toBeTypeOf('string');
    expect(response.country).toBeTypeOf('string');
    expect(response.countryCode).toBeTypeOf('string');
    expect(response.lat).toBeTypeOf('number');
    expect(response.lon).toBeTypeOf('number');
    expect(response.outboundIPs).toBeInstanceOf(Array);
    expect(response.tags).toBeInstanceOf(Array);
  });

  it('should get "par" zone by name with ownerId', async () => {
    const response = await support.client.send(
      new GetZoneCommand({ zoneName: 'par', ownerId: support.organisationId }),
    );

    expect(response.id).toBeTypeOf('string');
    expect(response.name).toBeTypeOf('string');
    expect(response.country).toBeTypeOf('string');
    expect(response.countryCode).toBeTypeOf('string');
    expect(response.lat).toBeTypeOf('number');
    expect(response.lon).toBeTypeOf('number');
    expect(response.outboundIPs).toBeInstanceOf(Array);
    expect(response.tags).toBeInstanceOf(Array);
  });
});
