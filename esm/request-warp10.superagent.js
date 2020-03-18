import req from 'superagent';

export function execWarpscript (requestParams, options = {}) {

  const { retry = 0, timeout = 30000 } = options;

  return req('post', requestParams.url)
    .retry(retry)
    .timeout({ response: timeout })
    .send(requestParams.body)
    .then((r) => {
      if (r.status !== 200) {
        const warp10error = 'Warp10 Error: ' + r.headers.get('X-Warp10-Error-Message');
        throw new Error(warp10error);
      }
      return JSON.parse(r.text);
    })
    .then((response) => {
      return (requestParams.responseHandler != null)
        ? requestParams.responseHandler(response)
        : response;
    });
}
