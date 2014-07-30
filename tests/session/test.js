var client = CleverAPI({
  API_CONSUMER_KEY: "aaaa",
  API_CONSUMER_SECRET: "bbbb",
  API_HOST: "http://127.0.0.1:1234"
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
