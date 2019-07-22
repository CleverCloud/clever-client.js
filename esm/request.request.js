import req from 'request';

export async function request (requestParams) {

  const jsonRequest = (requestParams.headers['Content-Type'] === 'application/json');
  const jsonResponse = (requestParams.headers['Accept'] === 'application/json');
  const bodyIsString = (typeof requestParams.body === 'string');

  const json = !bodyIsString && (jsonRequest || jsonResponse);

  const options = {
    url: requestParams.url,
    method: requestParams.method,
    headers: requestParams.headers,
    qs: requestParams.queryParams,
    body: requestParams.body,
    json,
  };

  return new Promise((resolve, reject) => {
    req(options, (error, response, resBody) => {
      if (response.statusCode >= 400) {
        return reject(Error(resBody.message));
      }
      return (error != null) ? reject(error) : resolve(resBody);
    });
  });
}
