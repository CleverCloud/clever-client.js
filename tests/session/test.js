var client = CleverAPI({
 API_CONSUMER_KEY: "MR2SL4MbJwq7KzV9l3nb3Rjf4zfxV4",
 API_CONSUMER_SECRET: "T3edg2H69hWK0DXUy7gyzlX5NlyFe6",
 API_HOST: "https://ccapi-preprod.cleverapps.io/v2"
});

var search = _.foldl(window.location.search.slice(1).split("&"), function(search, pair) {
  var key = pair.split("=")[0];
  var value = pair.split("=")[1];

  if(key) {
    search[key] = value;
  }

  return search;
}, {});

if(!search.oauth_token) {
  client.session.login();
}
else {
  client.session.getAccessTokenFromQueryString().onValue(function() {
    document.getElementById("success").textContent = "OAuth dance does work!";
  });
}
