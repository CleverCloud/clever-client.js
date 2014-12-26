var CleverAPI = (function(_, WadlClient) {
  var CleverAPI = function(settings) {
    _.defaults(settings, {
      API_HOST: "https://api.clever-cloud.com/v2"
    });

    var headers = !settings.API_AUTHORIZATION ? {} : {
      "Authorization": settings.API_AUTHORIZATION,
      "Content-Type": "application/json"
    };

    var client = WadlClient.buildClient(methods, {
      host: settings.API_HOST,
      headers: headers,
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
