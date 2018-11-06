var Session = (function(_, querystring, oauthSignature, crypto) {
  var Session = function(client, settings) {
    var session = {};

    session.getOAuthParams = function(token_secret) {
      return {
        oauth_consumer_key: settings.API_CONSUMER_KEY,
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: settings.API_CONSUMER_SECRET + "&" + (token_secret || ""),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_nonce: Math.floor(Math.random()*1000000)
      };
    };

    session.login = typeof window == "undefined" ? function(){} : function(oauth_callback) {
      var params = _.extend(session.getOAuthParams(), {
        oauth_callback: oauth_callback || window.location.href
      });

      var res = client.oauth.request_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": ""
      }).send(querystring.encode(params));

      // A delay(1000) has been added here because for some reason, firefox doesn't have the time to
      // store the localStorage elements if the redirection happens right after
      // which means that our web clients will have a login loop.
      res
        .map(function(data) {
          var parsed = querystring.decode(data);

          window.localStorage.setItem("consumer_oauth_token", parsed.oauth_token);
          window.localStorage.setItem("consumer_oauth_token_secret", parsed.oauth_token_secret);
          return parsed;
        })
        .delay(1000)
        .onValue(function(parsed) {
          window.location = settings.API_HOST + "/oauth/authorize?oauth_token=" + encodeURIComponent(parsed.oauth_token);
        });
    };

    session.getAccessTokenFromQueryString = typeof window == "undefined" ? function(){} : function() {
      var params = querystring.decode(window.location.search.slice(1));

      params.consumer_oauth_token = window.localStorage.getItem("consumer_oauth_token") || "";
      params.consumer_oauth_token_secret = window.localStorage.getItem("consumer_oauth_token_secret") || "";

      return session.getAccessToken(params);
    };

    session.getAccessToken = function(params) {
      var oauthParams = _.extend(session.getOAuthParams(params.consumer_oauth_token_secret), {
        oauth_token: params.oauth_token,
        oauth_verifier: params.oauth_verifier
      });

      var res = client.oauth.access_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      }).send(querystring.encode(oauthParams));

      var s_accessTokens = res.map(function(data) {
        return querystring.decode(data);
      });

      s_accessTokens.onValue(function(tokens) {
        if(typeof window !== "undefined" && typeof window.localStorage != "undefined") {
          window.localStorage.setItem("user_oauth_token", tokens.oauth_token);
          window.localStorage.setItem("user_oauth_token_secret", tokens.oauth_token_secret);
        }
      });

      return s_accessTokens;
    };

    session.getAuthorization = function(tokens) {
      if(tokens.user_oauth_token && tokens.user_oauth_token_secret) {
        var params = _.extend(session.getOAuthParams(tokens.user_oauth_token_secret), {
          oauth_token: tokens.user_oauth_token
        });

        return  ["OAuth realm=\"" + settings.API_HOST + "/oauth\"",
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

    session.getHMACAuthorization = function(httpMethod, url, queryparams, tokens) {
      if(tokens.user_oauth_token && tokens.user_oauth_token_secret) {
        var params = _.extend({}, queryparams, session.getOAuthParams(tokens.user_oauth_token_secret), {
          oauth_signature_method: "HMAC-SHA512",
          oauth_token: tokens.user_oauth_token
        });

        var signature = session.signHmacSHA512(httpMethod, url, _.omit(params, "oauth_signature"), tokens);

        return  ["OAuth realm=\"" + settings.API_HOST + "/oauth\"",
                "oauth_consumer_key=\"" + params.oauth_consumer_key + "\"",
                "oauth_token=\"" + params.oauth_token + "\"",
                "oauth_signature_method=\"" + params.oauth_signature_method + "\"",
                "oauth_signature=\"" + signature + "\"",
                "oauth_timestamp=\"" + params.oauth_timestamp + "\"",
                "oauth_nonce=\"" + params.oauth_nonce + "\""].join(", ");
      }
      else {
        return "";
      }
    };

    session.signHmacSHA512 = function(httpMethod, url, params, tokens){
      var key = [
        settings.API_CONSUMER_SECRET,
        tokens.user_oauth_token_secret
      ].map(oauthSignature.rfc3986).join('&');
      var base = oauthSignature.generateBase(httpMethod, url, params);

      return crypto.createHmac("sha512", key).update(base).digest('base64');
    };

    session.remove = function() {
      if(typeof window !== "undefined" && typeof window.localStorage != "undefined") {
        window.localStorage.removeItem("consumer_oauth_token");
        window.localStorage.removeItem("consumer_oauth_token_secret");
        window.localStorage.removeItem("user_oauth_token");
        window.localStorage.removeItem("user_oauth_token_secret");
      }
    };

    return session;
  };

  return Session;
})(
  typeof require == "function" && require("lodash") ? require("lodash") : _,
  typeof require == "function" && require("querystring") ? require("querystring") : querystring,
  typeof require == "function" && require("oauth-sign") ? require("oauth-sign") : oauthSignature,
  typeof require == "function" && require("crypto") ? require("crypto") : crypto
);
