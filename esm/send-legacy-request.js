export function sendLegacyRequest (sendCallback) {

  const req = {};
  req.params = [];
  req.headers = {};
  req.query = {};
  req.parse = true;
  req.timeout = 30000;
  req.logger = {};

  req.send = function (body) {
    return sendCallback(req, body);
  };

  req.withParams = function (params) {
    req.params = params;
    return req;
  };

  req.withHeaders = function (headers) {
    for (const name in headers) {
      req.headers[name] = headers[name];
    }
    return req;
  };

  req.withQuery = function (query) {
    req.query = query;
    return req;
  };

  req.withParsing = function (parse) {
    req.parse = typeof parse === 'undefined' ? true : parse;
    return req;
  };

  req.withTimeout = function (timeout) {
    req.timeout = timeout;
    return req;
  };

  req.withLogger = function (logger) {
    req.logger = logger;
    return req;
  };

  return req;
}
