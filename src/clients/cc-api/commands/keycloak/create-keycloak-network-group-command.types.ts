import type { KeycloakInfo } from './keycloak.types.js';

/**
 * Identifies the add-on to put behind a network group.
 */
export type CreateKeycloakNetworkGroupCommandInput = {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
};

/**
 * The add-on as it stands once it sits behind the network group.
 */
export type CreateKeycloakNetworkGroupCommandOutput = KeycloakInfo;
