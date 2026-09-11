import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { GetPriceSystemCommand } from '../../../../../src/clients/cc-api/commands/price-system/get-price-system-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('price system commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
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

    expect(response.zone).toBe('par');
    expect(response.currency).toBe('EUR');
    expect(response.runtimes).toBeInstanceOf(Array);
    expect(response.runtimes[0].id).toBeTypeOf('string');
    expect(response.runtimes[0].source).toBeTypeOf('string');
    expect(response.runtimes[0].flavor).toBeTypeOf('string');
    expect(response.runtimes[0].timeUnit).toBeTypeOf('string');
    expect(response.runtimes[0].price).toBeTypeOf('number');
    expect(response.runtimes[0].priceId).toBeTypeOf('string');
    expect(response.countables).toBeInstanceOf(Array);
    expect(response.countables[0].id).toBeTypeOf('string');
    expect(response.countables[0].service).toBeTypeOf('string');
    expect(response.countables[0].dataUnit).toBeTypeOf('string');
    expect(response.countables[0].dataQuantityForPrice.secability).toBeTypeOf('string');
    expect(response.countables[0].dataQuantityForPrice.quantity).toBeTypeOf('number');
    expect(response.countables[0]).toHaveProperty('timeIntervalForPrice');
    expect(response.countables[0].pricePlans).toBeInstanceOf(Array);
    expect(response.countables[0].pricePlans[0].planId).toBeTypeOf('string');
    expect(response.countables[0].pricePlans[0].maxQuantity).toBeTypeOf('number');
    expect(response.countables[0].pricePlans[0].price).toBeTypeOf('number');

    const services = response.countables.map((countable) => countable.service);
    expect(services).toEqual([...services].sort());
  });

  it('should get the public price system when ownerId is omitted', async () => {
    const response = await support.client.send(
      new GetPriceSystemCommand({
        zone: 'par',
        currency: 'EUR',
      }),
    );

    expect(response.currency).toBe('EUR');
    expect(response.runtimes).toBeInstanceOf(Array);
    expect(response.runtimes[0].id).toBeTypeOf('string');
    expect(response.countables).toBeInstanceOf(Array);
    expect(response.countables[0].id).toBeTypeOf('string');
  });
});
