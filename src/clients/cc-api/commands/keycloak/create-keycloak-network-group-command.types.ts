import type { KeycloakInfo } from './keycloak.types.js';

export type CreateKeycloakNetworkGroupCommandInput = {
  addonId: string;
};

export type CreateKeycloakNetworkGroupCommandOutput = KeycloakInfo;
