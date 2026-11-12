import { describe, expect, it } from 'vitest';
import {
  transformNotice,
  transformProviderNotice,
} from '../../../../../../src/clients/cc-api/commands/notice/notice-transform.ts';

const PAYLOAD = {
  id: '6f1c2a90-1b3e-4c2d-9a51-0e7d2f3b8c11',
  title: 'Scheduled maintenance',
  message: 'A maintenance is planned on Nov 3rd, 10:00 UTC.',
  intent: 'warning',
};

describe('notice-transform', () => {
  describe('transformNotice', () => {
    it('should keep only the notice fields', () => {
      const notice = transformNotice({ ...PAYLOAD, addonProviderId: 'postgresql-addon' });

      expect(notice).toEqual(PAYLOAD);
    });
  });

  describe('transformProviderNotice', () => {
    it('should keep the provider of a notice about one provider', () => {
      const notice = transformProviderNotice({ ...PAYLOAD, addonProviderId: 'postgresql-addon' });

      expect(notice).toEqual({ ...PAYLOAD, addonProviderId: 'postgresql-addon' });
    });

    it('should leave the provider undefined for a notice about the whole list', () => {
      const notice = transformProviderNotice({ ...PAYLOAD, addonProviderId: null });

      expect(notice.addonProviderId).toBeUndefined();
    });
  });
});
