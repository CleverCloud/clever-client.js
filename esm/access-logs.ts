import type { Warp10RequestParams } from './request-warp10.types.js';

export function getStatusCodesFromWarp10({
  warpToken,
  ownerId,
  appId,
}: {
  warpToken: string;
  ownerId: string;
  appId: string;
}): Promise<Warp10RequestParams> {
  const [granularity, id] = getGranularity(ownerId, appId);
  const warpscript = `'${warpToken}' '${granularity}' '${id}' NOW 24 h @clevercloud/accessLogs_status_code_v1`;

  return Promise.resolve({
    method: 'post',
    url: '/api/v0/exec',
    body: warpscript,
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: { __: getSlug('statuscodes', ownerId, appId) },
    responseHandler([results]) {
      // Remove status codes "-1" YOLO
      delete results['-1'];
      return results;
    },
  });
}

function getGranularity(ownerId: string, appId: string): string[] {
  return appId != null ? ['app_id', appId] : ['owner_id', ownerId];
}

function getSlug(prefix: string, ...items: Array<string>): string {
  const shortItems = items.filter((a) => a != null).map((a) => a.slice(0, 10));
  return [prefix, ...shortItems].join('__');
}
