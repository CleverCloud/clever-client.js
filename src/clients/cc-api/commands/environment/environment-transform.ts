import type { LinkedAddonEnvironment, LinkedApplicationEnvironment } from './environment.types.js';

export function transformLinkedApplicationsEnvironment(response: any): Array<LinkedApplicationEnvironment> {
  return response.map((element: any) => ({
    applicationId: element.app_id,
    applicationName: element.app_name,
    environment: element.env,
  }));
}

export function transformLinkedAddonsEnvironment(response: any): Array<LinkedAddonEnvironment> {
  return response.map((element: any) => ({
    addonProviderId: element.provider_id,
    addonId: element.addon_id,
    addonName: element.addon_name,
    environment: element.env,
  }));
}
