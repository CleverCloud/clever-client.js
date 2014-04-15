function CleverAPI(settings) {
  var headers = !settings.authorization ? {} : {
    "Authorization": settings.authorization,
    "Content-Type": "application/json"
  };

  return WadlClient.buildClient(methods, {
    host: settings.host,
    headers: headers
  });
}
