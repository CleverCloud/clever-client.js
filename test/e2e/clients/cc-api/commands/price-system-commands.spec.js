import { expect } from 'chai';
import { GetPriceSystemCommand } from '../../../../../src/clients/cc-api/commands/price-system/get-price-system-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('price system commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {});

  it('should get price system', async () => {
    const response = await support.client.send(
      new GetPriceSystemCommand({
        ownerId: support.organisationId,
        zone: 'par',
      }),
    );

    expect(response.zone).to.equal('par');
    expect(response.currency).to.equal('EUR');
    expect(response.runtime).to.be.an('array');
    expect(response.runtime[0].id).to.be.an('string');
    expect(response.runtime[0].source).to.be.a('string');
    expect(response.runtime[0].flavor).to.be.a('string');
    expect(response.runtime[0].timeUnit).to.be.a('string');
    expect(response.runtime[0].price).to.be.a('number');
    expect(response.runtime[0].priceId).to.be.a('string');
    expect(response.countable).to.be.an('array');
    expect(response.countable[0].id).to.be.a('string');
    expect(response.countable[0].service).to.be.a('string');
    expect(response.countable[0].dataUnit).to.be.a('string');
    expect(response.countable[0].dataQuantityForPrice.secability).to.be.a('string');
    expect(response.countable[0].dataQuantityForPrice.quantity).to.be.a('number');
    expect(response.countable[0]).to.ownProperty('timeIntervalForPrice');
    expect(response.countable[0].pricePlans).to.be.an('array');
    expect(response.countable[0].pricePlans[0].planId).to.be.a('string');
    expect(response.countable[0].pricePlans[0].maxQuantity).to.be.a('number');
    expect(response.countable[0].pricePlans[0].price).to.be.a('number');
  });
});
