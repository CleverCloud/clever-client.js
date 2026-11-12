import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ActivateCouponCommand } from '../../../../../src/clients/cc-api/commands/credits/activate-coupon-command.ts';
import { GetCreditsSummaryCommand } from '../../../../../src/clients/cc-api/commands/credits/get-credits-summary-command.ts';
import { checkDateFormat } from '../../../../lib/expect-utils.ts';
import { e2eSupport } from '../e2e-support.ts';

describe('credits commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should get credits', async () => {
    const response = await support.client.send(new GetCreditsSummaryCommand({ ownerId: support.organisationId }));

    expect(response.prepaidCredit).toBeTypeOf('number');
    expect(response.freeCredit).toBeTypeOf('number');
    expect(response.currency).toBeTypeOf('string');
  });

  // cannot be automatised because a coupon cannot be activated more than once
  it.skip('should activate coupon', async () => {
    const couponName = 'COUPON_DUMMY';

    const response = await support.client.send(
      new ActivateCouponCommand({ ownerId: support.organisationId, couponName }),
    );

    expect(response.couponName).toBe(couponName);
    checkDateFormat(response.usedAt);
    checkDateFormat(response.freeCreditsStartsAt);
    checkDateFormat(response.freeCreditsEndsAt);
    expect(response.appliedByUserId).toBe(support.userId);
  });
});
