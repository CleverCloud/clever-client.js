function initializeSession(client, settings) {
  var oauth_params = function(config, token_secret) {
    return _.extend({
      oauth_consumer_key: settings.API_CONSUMER_KEY,
      oauth_signature_method: 'PLAINTEXT',
      oauth_signature: settings.API_CONSUMER_SECRET + '&' + (token_secret || ''),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_nonce: Math.floor(Math.random()*1000000)
    }, config);
  };

  var Session = {};

  Session.login = function() {
    var res = client.oauth.request_token.post()({
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      data: querystring.encode(oauth_params({
        oauth_callback: window.location.protocol + '//' + window.location.host + window.location.pathname
      }))
    });

    return res.map(function(text) {
      var parsed = querystring.decode(text);

      localStorage.consumer_oauth_token = parsed.oauth_token;
      localStorage.consumer_oauth_token_secret = parsed.oauth_token_secret;

      window.location = settings.API_HOST + '/oauth/authorize?oauth_token=' + encodeURIComponent(parsed.oauth_token);
    });
  };

  Session.getAccessToken = function(params) {
    var res = client.oauth.access_token.post()({
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      data: querystring.encode(oauth_params(params, localStorage.consumer_oauth_token_secret))
    });

    return res.map(function(text) {
      var parsed = querystring.decode(text);

      localStorage.user_oauth_token = parsed.oauth_token;
      localStorage.user_oauth_token_secret = parsed.oauth_token_secret;

      return parsed;
    });
  };

  Session.getAuthorization = function() {
    if(localStorage.user_oauth_token && localStorage.user_oauth_token_secret) {
      var params = oauth_params({oauth_token: localStorage.user_oauth_token}, localStorage.user_oauth_token_secret);
      return  ['OAuth realm="http://ccapi.cleverapps.io/v2/oauth"',
              'oauth_consumer_key="' + params.oauth_consumer_key + '"',
              'oauth_token="' + params.oauth_token + '"',
              'oauth_signature_method="' + params.oauth_signature_method + '"',
              'oauth_signature="' + params.oauth_signature + '"',
              'oauth_timestamp="' + params.oauth_timestamp + '"',
              'oauth_nonce="' + params.oauth_nonce + '"'].join(', ');
    }
    else {
      return '';
    }
  };

  Session.remove = function() {
    localStorage.removeItem("consumer_oauth_token");
    localStorage.removeItem("consumer_oauth_token_secret");
    localStorage.removeItem("user_oauth_token");
    localStorage.removeItem("user_oauth_token_secret");
  };

  return Session;
}
