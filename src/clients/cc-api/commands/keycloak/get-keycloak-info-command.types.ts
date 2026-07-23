import type { KeycloakInfo } from './keycloak.types.js';

/**
 * Identifies the add-on to retrieve.
 */
export type GetKeycloakInfoCommandInput = {
  /** Identifier of the add-on. Resolved to the provider-side identifier before the request is sent. */
  addonId: string;
};

/**
 * The requested add-on.
 */
export type GetKeycloakInfoCommandOutput = KeycloakInfo;
