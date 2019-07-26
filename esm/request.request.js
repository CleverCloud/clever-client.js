import req from 'request';

const JSON_TYPE = 'application/json';
const FORM_TYPE = 'application/x-www-form-urlencoded';

function formatBody (requestParams) {

  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === JSON_TYPE && typeof requestParams.body !== 'string') {
    return JSON.stringify(requestParams.body);
  }

  // for now we support the fact that users sometimes already stringified the body
  if (requestParams.headers['Content-Type'] === FORM_TYPE && typeof requestParams.body !== 'string') {
    const qs = new URLSearchParams();
    Object
      .entries(requestParams.body)
      .forEach(([name, value]) => qs.set(name, value));
    return qs.toString();
  }

  return requestParams.body;
}

function parseResponseBody (response, rawBody) {

  if (response.headers['content-type'] === JSON_TYPE) {
    return JSON.parse(rawBody);
  }

  if (FORM_TYPE && response.headers['content-type'] === FORM_TYPE) {
    const responseObject = {};
    Array
      .from(new URLSearchParams(rawBody).entries())
      .forEach(([name, value]) => (responseObject[name] = value));
    return responseObject;
    // TODO: return Object.fromEntries(new URLSearchParams(rawBody).entries())
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
      const responseBody = parseResponseBody(response, rawBody);
      if (response.statusCode >= 400) {
        const errorMessage = (responseBody.message != null)
          ? responseBody.message
          : responseBody;
        const error = new Error(errorMessage);
        error.response = response;
        return reject(error);
      }
      return resolve(responseBody);
    });
  });
}
