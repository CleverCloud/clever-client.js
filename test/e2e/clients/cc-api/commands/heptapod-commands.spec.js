import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GetHeptapodPriceEstimationCommand } from '../../../../../src/clients/cc-api/commands/heptapod/get-heptapod-price-estimation-command.js';
import { e2eSupport, STATIC_ORGANISATION_ID } from '../e2e-support.js';

describe('heptapod commands', function () {
  const support = e2eSupport({ user: 'test-user-without-github' });

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should get null heptapod price estimation on user organisation', async () => {
    const response = await support.client.send(new GetHeptapodPriceEstimationCommand({ ownerId: support.userId }));

    expect(response).toBeNull();
  });

  it.skip('should get heptapod price estimation on organisation', async () => {
    const response = await support.client.send(
      new GetHeptapodPriceEstimationCommand({ ownerId: STATIC_ORGANISATION_ID }),
    );

    expect(response.publicActiveUsers).toBeTypeOf('number');
    expect(response.privateActiveUsers).toBeTypeOf('number');
    expect(response.storage).toBeTypeOf('number');
    expect(response.price).toBeTypeOf('number');
  });
});
