import { expect } from 'chai';
import { ERROR_TYPES, getAllOrgaPaymentMethodsErrors, getOrgaPaymentMethodsError } from '../esm/utils/payment.js';

const simpleOrga = {
  id: 'orga_???',
  name: '???',
  description: '???',
  billingEmail: '???@???.com',
  address: '???',
  city: '???',
  zipcode: '???',
  country: '???',
  company: '???',
  VAT: '???',
  avatar: 'https://example.com',
  vatState: 'VALID',
  customerFullName: '???',
  canPay: false,
  cleverEnterprise: false,
  emergencyNumber: null,
  canSEPA: false,
  isTrusted: false,
};
const simpleOrgaFoo = { ...simpleOrga, id: 'orga_foo' };
const simpleOrgaBar = { ...simpleOrga, id: 'orga_bar' };
const premiumOrga = { ...simpleOrga, cleverEnterprise: true };
const trustedOrga = { ...simpleOrga, isTrusted: true };
const premiumAndTrustedOrga = { ...simpleOrga, cleverEnterprise: true, isTrusted: true };

const simpleCard = {
  ownerId: 'orga_???',
  type: 'CREDITCARD',
  token: '???',
  isDefault: false,
  number: '???',
  holderName: null,
  expirationDate: '20??-??-??',
  isExpired: false,
  cardType: '???',
};
const simpleDefaultCard = { ...simpleCard, isDefault: true };
const expiredDefaultCard = { ...simpleCard, isExpired: true, isDefault: true };

const simpleSepa = {
  ownerId: 'orga_???',
  type: 'SEPA_DEBIT',
  token: '???',
  isDefault: false,
  number: '???',
  bankCode: '???',
  branchCode: '???',
  country: '??',
  fingerprint: '???',
};
const simpleDefaultSepa = { ...simpleSepa, isDefault: true };

describe('getOrgaPaymentMethodsErrors()', () => {
  describe('simple orga', () => {
    it('default payment method', () => {
      const errors = getOrgaPaymentMethodsError(simpleOrga, [simpleDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('no payment method', () => {
      const errors = getOrgaPaymentMethodsError(simpleOrga, []);
      expect(errors).to.deep.equal(ERROR_TYPES.NO_PAYMENT_METHOD);
    });
    it('no default payment method', () => {
      const errors = getOrgaPaymentMethodsError(simpleOrga, [simpleCard, simpleSepa]);
      expect(errors).to.deep.equal(ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD);
    });
    it('expired default payment method', () => {
      const errors = getOrgaPaymentMethodsError(simpleOrga, [expiredDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED);
    });
  });

  describe('premium orga', () => {
    it('default payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumOrga, [simpleDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('no payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumOrga, []);
      expect(errors).to.deep.equal(null);
    });
    it('no default payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumOrga, [simpleCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('expired default payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumOrga, [expiredDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
  });

  describe('trusted orga', () => {
    it('default payment method', () => {
      const errors = getOrgaPaymentMethodsError(trustedOrga, [simpleDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('no payment method', () => {
      const errors = getOrgaPaymentMethodsError(trustedOrga, []);
      expect(errors).to.deep.equal(null);
    });
    it('no default payment method', () => {
      const errors = getOrgaPaymentMethodsError(trustedOrga, [simpleCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('expired default payment method', () => {
      const errors = getOrgaPaymentMethodsError(trustedOrga, [expiredDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
  });

  describe('premium and trusted orga', () => {
    it('default payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumAndTrustedOrga, [simpleDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('no payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumAndTrustedOrga, []);
      expect(errors).to.deep.equal(null);
    });
    it('no default payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumAndTrustedOrga, [simpleCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
    it('expired default payment method', () => {
      const errors = getOrgaPaymentMethodsError(premiumAndTrustedOrga, [expiredDefaultCard, simpleSepa]);
      expect(errors).to.deep.equal(null);
    });
  });
});

describe('checkAllOrgaPaymentMethods', () => {
  it('personal orga only without errors', () => {
    const errors = getAllOrgaPaymentMethodsErrors({ orga: simpleOrga, paymentMethods: [simpleDefaultCard] });
    expect(errors).to.deep.equal([]);
  });

  it('personal orga only with errors', () => {
    const errors = getAllOrgaPaymentMethodsErrors({ orga: simpleOrga, paymentMethods: [] });
    expect(errors).to.deep.equal([{ type: ERROR_TYPES.NO_PAYMENT_METHOD, orga: simpleOrga }]);
  });

  it('other orgas without errors', () => {
    const errors = getAllOrgaPaymentMethodsErrors({ orga: simpleOrga, paymentMethods: [] }, [
      { orga: simpleOrgaFoo, paymentMethods: [simpleDefaultCard] },
      { orga: simpleOrgaBar, paymentMethods: [simpleDefaultSepa] },
    ]);
    expect(errors).to.deep.equal([]);
  });

  it('other orgas with one with errors', () => {
    const errors = getAllOrgaPaymentMethodsErrors({ orga: simpleOrga, paymentMethods: [] }, [
      { orga: simpleOrgaFoo, paymentMethods: [simpleCard] },
      { orga: simpleOrgaBar, paymentMethods: [simpleDefaultSepa] },
    ]);
    expect(errors).to.deep.equal([{ type: ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD, orga: simpleOrgaFoo }]);
  });

  it('other orgas with many with errors', () => {
    const errors = getAllOrgaPaymentMethodsErrors({ orga: simpleOrga, paymentMethods: [] }, [
      { orga: simpleOrgaFoo, paymentMethods: [simpleCard] },
      { orga: simpleOrgaBar, paymentMethods: [simpleCard] },
    ]);
    expect(errors).to.deep.equal([
      { type: ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD, orga: simpleOrgaFoo },
      { type: ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD, orga: simpleOrgaBar },
    ]);
  });
});
