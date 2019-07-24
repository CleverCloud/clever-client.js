import req from 'request';

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

function formatBody (requestParams) {

  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === JSON_TYPE && typeof requestParams.body !== 'string') {
    return JSON.stringify(requestParams.body);
  }

  if (requestParams.headers['Content-Type'] === FORM_TYPE && typeof requestParams.body !== 'string') {
    const qs = new URLSearchParams();
    Object
      .entries(requestParams.body)
      .forEach(([name, value]) => qs.set(name, value));
    return qs.toString();
  }

  return requestParams.body;
}

function formatResponse (requestParams, response, rawBody) {

  if (requestParams.headers['Accept'] === JSON_TYPE && response.headers['content-type'] === JSON_TYPE) {
    return JSON.parse(rawBody);
  }

  if (requestParams.headers['Accept'] === FORM_TYPE && response.headers['content-type'] === FORM_TYPE) {
    const objectResponse = {};
    Array
      .from(new URLSearchParams(rawBody).entries())
      .forEach(([name, value]) => (objectResponse[name] = value));
    return objectResponse;
  }

  return rawBody;
}

export async function request (requestParams) {

  const body = formatBody(requestParams);

  const options = {
    url: requestParams.url,
    method: requestParams.method,
    headers: requestParams.headers,
    qs: requestParams.queryParams,
    body,
    json: false,
  };

  return new Promise((resolve, reject) => {
    req(options, (error, response, rawBody) => {
      if (error != null) {
        return reject(error);
      }
      const responseBody = formatResponse(requestParams, response, rawBody);
      if (response.statusCode >= 400) {
        return reject(Error(responseBody.message));
      }
      return resolve(responseBody);
    });
  });
}
