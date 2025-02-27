export function getStatusCodesFromWarp10 ({ warpToken, ownerId, appId }) {

  const [granularity, id] = getGranularity(ownerId, appId);
  const warpscript = `'${warpToken}' '${granularity}' '${id}' NOW 24 h @clevercloud/accessLogs_status_code_v1`;

  return Promise.resolve({
    method: 'post',
    url: '/api/v0/exec',
    body: warpscript,
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: { __: getSlug('statuscodes', ownerId, appId) },
    responseHandler ([results]) {
      // Remove status codes "-1" YOLO
      delete results['-1'];
      return results;
    },
  });
}

function getGranularity (ownerId, appId) {
  return (appId != null)
    ? ['app_id', appId]
    : ['owner_id', ownerId];
}

function getSlug (prefix, ...items) {
  const shortItems = items
    .filter((a) => a != null)
    .map((a) => a.slice(0, 10));
  return [prefix, ...shortItems].join('__');
}
