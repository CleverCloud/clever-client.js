import type { KeycloakInfo } from './keycloak.types.js';

export type UpdateKeycloakVersionCommandInput = {
  addonId: string;
  targetVersion: string;
};

export type UpdateKeycloakVersionCommandOutput = KeycloakInfo;
