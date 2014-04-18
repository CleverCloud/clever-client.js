function CleverAPI(settings) {
  settings = _.extend(settings || {}, {
    API_HOST: "https://api.clever-cloud.com/v2"
  });

  var headers = !settings.authorization ? {} : {
    "Authorization": settings.authorization,
    "Content-Type": "application/json"
  };

  var client = WadlClient.buildClient(methods, {
    host: settings.API_HOST,
    headers: headers
  });

  client.session = initializeSession(client, settings);

  return client;
}
