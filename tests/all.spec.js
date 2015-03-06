var tokens = {
  consumer_oauth_token: "aaaa",
  consumer_oauth_token_secret: "bbbb",
  user_oauth_token: "ffff",
  user_oauth_token_secret: "gggg"
};

var anonymousClient = require("../dist/clever-client.js")({
  API_CONSUMER_KEY: tokens.consumer_oauth_token,
  API_CONSUMER_SECRET: tokens.consumer_oauth_token_secret,
  API_HOST: "http://localhost:8080"
});

var client = require("../dist/clever-client.js")({
  API_HOST: "http://localhost:8080",
  API_AUTHORIZATION: anonymousClient.session.getAuthorization(tokens)
});

require("./spec/owner.js")(client);
require("./spec/self.js")(client);
require("./spec/organisations.js")(client);
require("./spec/applications.js")(client);
require("./spec/addons.js")(client);

module.exports = {};
