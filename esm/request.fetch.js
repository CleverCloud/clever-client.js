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

function formatResponse (requestParams, response) {

  if (requestParams.headers['Accept'] === JSON_TYPE && response.headers.get('Content-Type') === JSON_TYPE) {
    return response.json();
  }

  if (requestParams.headers['Accept'] === FORM_TYPE && response.headers.get('Content-Type') === FORM_TYPE) {
    return response.text()
      .then((text) => {
        const objectResponse = {};
        Array
          .from(new URLSearchParams(text).entries())
          .forEach(([name, value]) => (objectResponse[name] = value));
        return objectResponse;
      });
  }

  return response.text();
}

export async function request (requestParams) {

  const url = new URL(requestParams.url);
  Object.entries(requestParams.queryParams || {})
    .forEach(([k, v]) => url.searchParams.set(k, v));

  // for now we support the fact that users sometimes already stringified the body
  const body = formatBody(requestParams);

  const response = await window.fetch(url.toString(), {
    ...requestParams,
    body,
    mode: 'cors',
  });

  if (response.status >= 400) {
    const responseError = await response.json();
    throw new Error(responseError.message);
  }

  if (response.status === 204) {
    return;
  }

  return formatResponse(requestParams, response);
}
