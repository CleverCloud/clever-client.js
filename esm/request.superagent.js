import req from 'superagent';

const JSON_TYPE = 'application/json';

function getErrorMessage (error) {
  if (error.code === 'EAI_AGAIN') {
    return `Cannot reach the Clever Cloud API, please check your internet connection.`;
  }
  if (error.response && error.response.body && error.response.body.message) {
    return error.response.body.message;
  }
  if (error.response && error.response.text) {
    try {
      const parsedText = JSON.parse(error.response.text);
      if (parsedText.message) {
        return parsedText.message;
      }
      // fallback
    }
    catch (e) {
      // fallback
    }
  }
  return `Error from API: ${error.response.status} ${error.message}`;
}

export async function request (requestParams) {

  return req(requestParams.method, requestParams.url)
    .set(requestParams.headers)
    .query(requestParams.queryParams)
    .send(requestParams.body)
    .then((response) => {
      return (response.headers['content-type'] === JSON_TYPE)
        ? response.body
        : response.text;
    })
    .catch((error) => {
      error.message = getErrorMessage(error);
      // NOTE: This is only for legacy
      if (error.response && error.response.body && error.response.body.id) {
        error.id = error.response.body.id;
      }
      throw error;
    });
}
