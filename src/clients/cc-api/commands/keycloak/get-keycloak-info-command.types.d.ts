import type { KeycloakInfo } from './keycloak.types.js';

export type GetKeycloakInfoCommandInput = {
  addonId: string;
};

export type GetKeycloakInfoCommandOutput = KeycloakInfo;
