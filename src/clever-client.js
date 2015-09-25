var CleverAPI = (function(_, WadlClient) {
  var CleverAPI = function(settings) {
    _.defaults(settings, {
      API_HOST: "https://ccapi-preprod.cleverapps.io/v2",
      hooks: {}
    });

    var headers = !settings.API_AUTHORIZATION ? {} : {
      "Authorization": settings.API_AUTHORIZATION
    };

    var addAuthorizationHeader = (settings.API_OAUTH_TOKEN && settings.API_OAUTH_TOKEN_SECRET) && function(requestSettings) {
      // if the Authorization header is not yet defined
      if(!_.has(requestSettings.headers, 'Authorization')){
        requestSettings.headers.Authorization = client.session.getHMACAuthorization(requestSettings.method, requestSettings.uri, requestSettings.qs, {
          user_oauth_token: settings.API_OAUTH_TOKEN,
          user_oauth_token_secret: settings.API_OAUTH_TOKEN_SECRET
        });
      }

      return requestSettings;
    };

    var client = WadlClient.buildClient(methods, {
      host: settings.API_HOST,
      headers: _.extend({}, headers, {
        "Content-Type": "application/json"
      }),
      logger: settings.logger,
      hooks: _.defaults(settings.hooks, {
        beforeSend: addAuthorizationHeader
      }),
      parse: true
    });

    client.owner = Owner(client, settings);
    client.session = Session(client, settings);

    return client;
  };

  if(typeof module != "undefined" && module.exports) {
    module.exports = CleverAPI;
  }

  return CleverAPI;
})(
  typeof require == "function" && require("lodash") ? require("lodash") : _,
  typeof require == "function" && require("wadl-client") ? require("wadl-client") : WadlClient
);
