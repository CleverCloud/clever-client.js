import type { Addon } from './addon.types.js';

/**
 * Description of the add-on to provision.
 */
export interface CreateAddonCommandInput {
  /** Identifier of the organisation the add-on will belong to. */
  ownerId: string;
  /** Display name to give to the add-on. */
  name: string;
  /**
   * Name of the zone to provision the add-on in.
   * @sentAs `region`
   */
  zone: string;
  /** Identifier of the add-on provider to provision from, for example `postgresql-addon`. */
  providerId: string;
  /** Identifier of the provider plan to subscribe to. */
  planId: string;
  /** Provider specific provisioning options, for example the engine version. Defaults to an empty map. */
  options?: Record<string, string>;
  /**
   * Identifier of an application to link the add-on to right after it is provisioned.
   * @sentAs `linkedApp`
   */
  linkedApplication?: string;
  /** Version of the add-on to provision, for providers that expose several versions. */
  version?: string;
  /** Stripe setup intent to charge the provisioning against, for paid add-ons. */
  paymentIntent?: AddonPaymentIntent;
  /** Payment method used to pay for the add-on. */
  paymentMethodType?: AddonPaymentMethodType;
  /** Identifier of the SEPA debit source to charge the provisioning against. */
  sepaSourceId?: string;
}

/**
 * A Stripe setup intent, identifying the payment authorisation to charge a paid provisioning against.
 */
export interface AddonPaymentIntent {
  /** Identifier of the organisation the setup intent belongs to. */
  ownerId: string;
  /** Identifier of the Stripe setup intent. */
  id: string;
  /** Client secret used to confirm the setup intent on the Stripe side. */
  clientSecret: string;
  /** Identifier of the Stripe customer the setup intent is attached to. */
  customer: string;
}

/**
 * The kind of payment method used to pay for an add-on.
 */
export type AddonPaymentMethodType = 'CREDITCARD' | 'PAYPAL' | 'SEPA_DEBIT';

/**
 * The freshly provisioned add-on.
 */
export type CreateAddonCommandOutput = Addon;
