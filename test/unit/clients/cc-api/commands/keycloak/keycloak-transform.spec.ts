import { describe, expect, it } from 'vitest';
import { transformKeycloakInfo } from '../../../../../../src/clients/cc-api/commands/keycloak/keycloak-transform.ts';

function makePayload(extra: Record<string, unknown> = {}) {
  return {
    resourceId: 'keycloak_00000000-0000-0000-0000-000000000000',
    addonId: 'addon_00000000-0000-0000-0000-000000000000',
    name: 'my-keycloak',
    ownerId: 'orga_00000000-0000-0000-0000-000000000000',
    plan: 'base',
    version: '26.0.0',
    javaVersion: '21',
    accessUrl: 'https://keycloak.example.com',
    initialCredentials: { user: 'admin', password: 'secret' },
    availableVersions: ['26.0.0'],
    resources: { entrypoint: 'app_x', fsbucketId: 'addon_y', pgsqlId: 'addon_z' },
    features: {},
    envVars: {},
    ...extra,
  };
}

describe('transformKeycloakInfo', () => {
  it('should forward monthlyActiveUsers', () => {
    expect(transformKeycloakInfo(makePayload({ monthlyActiveUsers: 42 })).monthlyActiveUsers).toBe(42);
  });

  it('should keep a monthlyActiveUsers of 0', () => {
    expect(transformKeycloakInfo(makePayload({ monthlyActiveUsers: 0 })).monthlyActiveUsers).toBe(0);
  });

  it('should leave monthlyActiveUsers undefined when the API omits it', () => {
    expect(transformKeycloakInfo(makePayload()).monthlyActiveUsers).toBeUndefined();
  });

  it('should map a null monthlyActiveUsers to undefined', () => {
    expect(transformKeycloakInfo(makePayload({ monthlyActiveUsers: null })).monthlyActiveUsers).toBeUndefined();
  });
});
