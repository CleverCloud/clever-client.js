export async function execWarpscript (requestParams) {

  const url = new URL(requestParams.url);
  Object
    .entries(requestParams.queryParams || {})
    .forEach(([k, v]) => url.searchParams.set(k, v));

  return window
    .fetch(url.toString(), {
      ...requestParams,
      mode: 'cors',
    })
    .then((response) => {
      if (response.status !== 200) {
        const warp10error = 'Warp10 Error: ' + response.headers.get('X-Warp10-Error-Message');
        throw new Error(warp10error);
      }
      return response.json();
    })
    .then((parsedResponse) => {
      return (requestParams.responseHandler != null)
        ? requestParams.responseHandler(parsedResponse)
        : parsedResponse;
    });
}
