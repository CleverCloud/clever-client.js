import { expect } from 'chai';
import { GetZoneCommand } from '../../../../../src/clients/cc-api/commands/zone/get-zone-command.js';
import { ListZoneCommand } from '../../../../../src/clients/cc-api/commands/zone/list-zone-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('zone commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should list all zones', async () => {
    const response = await support.client.send(new ListZoneCommand());

    expect(response[0].id).to.be.a('string');
    expect(response[0].name).to.be.a('string');
    expect(response[0].country).to.be.a('string');
    expect(response[0].countryCode).to.be.a('string');
    expect(response[0].lat).to.be.a('number');
    expect(response[0].lon).to.be.a('number');
    expect(response[0].outboundIPs).to.be.an('array');
    expect(response[0].tags).to.be.an('array');
  });

  it('should list zones for ownerId', async () => {
    const response = await support.client.send(new ListZoneCommand({ ownerId: support.organisationId }));

    expect(response[0].id).to.be.a('string');
    expect(response[0].name).to.be.a('string');
    expect(response[0].country).to.be.a('string');
    expect(response[0].countryCode).to.be.a('string');
    expect(response[0].lat).to.be.a('number');
    expect(response[0].lon).to.be.a('number');
    expect(response[0].outboundIPs).to.be.an('array');
    expect(response[0].tags).to.be.an('array');
  });

  it('should get "par" zone by name without ownerId', async () => {
    const response = await support.client.send(new GetZoneCommand({ zoneName: 'par' }));

    expect(response.id).to.be.a('string');
    expect(response.name).to.be.a('string');
    expect(response.country).to.be.a('string');
    expect(response.countryCode).to.be.a('string');
    expect(response.lat).to.be.a('number');
    expect(response.lon).to.be.a('number');
    expect(response.outboundIPs).to.be.an('array');
    expect(response.tags).to.be.an('array');
  });

  it('should get "par" zone by name with ownerId', async () => {
    const response = await support.client.send(
      new GetZoneCommand({ zoneName: 'par', ownerId: support.organisationId }),
    );

    expect(response.id).to.be.a('string');
    expect(response.name).to.be.a('string');
    expect(response.country).to.be.a('string');
    expect(response.countryCode).to.be.a('string');
    expect(response.lat).to.be.a('number');
    expect(response.lon).to.be.a('number');
    expect(response.outboundIPs).to.be.an('array');
    expect(response.tags).to.be.an('array');
  });
});
