function CleverAPI(settings) {
  settings = _.extend(settings || {}, {
    API_HOST: "https://api.clever-cloud.com/v2"
  });

  var headers = !settings.authorization ? {} : {
    "Authorization": settings.authorization,
    "Content-Type": "application/json"
  };

  var cleverAPI = {};

  var client = cleverAPI.client = WadlClient.buildClient(methods, {
    host: settings.API_HOST,
    headers: headers
  });

  cleverAPI.session = initializeSession(client, settings);

  return cleverAPI;
}
