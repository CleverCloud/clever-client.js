import type { Notice, ProviderNotice } from './notice.types.js';

export function transformNotice(payload: any): Notice {
  return {
    id: payload.id,
    title: payload.title,
    message: payload.message,
    intent: payload.intent,
  };
}

export function transformProviderNotice(payload: any): ProviderNotice {
  return {
    ...transformNotice(payload),
    addonProviderId: payload.addonProviderId ?? undefined,
  };
}
