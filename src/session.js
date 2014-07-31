var Session = (function(_, querystring) {
  var Session = function(client, settings) {
    var session = {};

    session.getOAuthParams = function(params, token_secret) {
      return _.extend({
        oauth_consumer_key: settings.API_CONSUMER_KEY,
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: settings.API_CONSUMER_SECRET + "&" + (token_secret || ""),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_nonce: Math.floor(Math.random()*1000000)
      }, params);
    };

    session.login = typeof window == "undefined" ? function(){} : function() {
      var res = client.oauth.request_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      }).send(querystring.encode(session.getOAuthParams({
        oauth_callback: window.location.href
      })));

      res.onValue(function(data) {
        var parsed = querystring.decode(data);

        if(typeof localStorage != "undefined") {
          localStorage.consumer_oauth_token = parsed.oauth_token;
          localStorage.consumer_oauth_token_secret = parsed.oauth_token_secret;
        }

        window.location = settings.API_HOST + "/oauth/authorize?oauth_token=" + encodeURIComponent(parsed.oauth_token);
      });
    };

    session.getAccessTokenFromQueryString = typeof window == "undefined" ? function(){} : function() {
      var params = querystring.decode(window.location.search.slice(1));

      params.consumer_oauth_token = typeof localStorage != "undefined" ? localStorage.consumer_oauth_token : "";
      params.consumer_oauth_token_secret = typeof localStorage != "undefined" ? localStorage.consumer_oauth_token_secret : "";

      return session.getAccessToken(params);
    };

    session.getAccessToken = function(params) {
      var res = client.oauth.access_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      }).send(querystring.encode(session.getOAuthParams(params, params.consumer_oauth_token_secret)));

      var s_accessTokens = res.map(function(data) {
        return querystring.decode(data);
      });

      s_accessTokens.onValue(function(tokens) {
        if(typeof localStorage != "undefined") {
          localStorage.user_oauth_token = tokens.oauth_token;
          localStorage.user_oauth_token_secret = tokens.oauth_token_secret;
        }
      });

      return s_accessTokens;
    };

    session.getAuthorization = function(tokens) {
      if(tokens.user_oauth_token && tokens.user_oauth_token_secret) {
        var params = session.getOAuthParams({oauth_token: tokens.user_oauth_token}, tokens.user_oauth_token_secret);
        return  ["OAuth realm=\"http://ccapi.cleverapps.io/v2/oauth\"",
                "oauth_consumer_key=\"" + params.oauth_consumer_key + "\"",
                "oauth_token=\"" + params.oauth_token + "\"",
                "oauth_signature_method=\"" + params.oauth_signature_method + "\"",
                "oauth_signature=\"" + params.oauth_signature + "\"",
                "oauth_timestamp=\"" + params.oauth_timestamp + "\"",
                "oauth_nonce=\"" + params.oauth_nonce + "\""].join(", ");
      }
      else {
        return "";
      }
    };

    session.remove = function() {
      if(typeof localStorage != "undefined") {
        localStorage.removeItem("consumer_oauth_token");
        localStorage.removeItem("consumer_oauth_token_secret");
        localStorage.removeItem("user_oauth_token");
        localStorage.removeItem("user_oauth_token_secret");
      }
    };

    return session;
  };

  return Session;
})(
  typeof require == "function" && require("lodash") ? require("lodash") : _,
  typeof require == "function" && require("querystring") ? require("querystring") : querystring
);
