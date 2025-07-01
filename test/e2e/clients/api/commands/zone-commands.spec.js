import { expect } from 'chai';
import { ListZoneCommand } from '../../../../../src/clients/api/commands/zone/list-zone-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

describe('zone commands', function () {
  this.timeout(10000);

  const support = e2eSupport(false);

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
});
