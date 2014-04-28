function CleverAPI(settings) {
  settings = _.extend({
    API_HOST: "https://api.clever-cloud.com/v2"
  }, settings);

  var headers = !settings.API_AUTHORIZATION ? {} : {
    "Authorization": settings.API_AUTHORIZATION,
    "Content-Type": "application/json"
  };

  var cleverAPI = {};

  var client = cleverAPI.client = WadlClient.buildClient(methods, {
    host: settings.API_HOST,
    headers: headers
  });

  cleverAPI.session = initializeSession(client, settings);
  cleverAPI.user = initializeUser(client, settings);
  cleverAPI.organisation = initializeOrganisation(client, settings);
  cleverAPI.application = initializeApplication(client, settings);

  return cleverAPI;
}
