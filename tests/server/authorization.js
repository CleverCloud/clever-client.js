var express = require("express");
var _ = require("lodash");

var connections = require("./data/connections.js");

module.exports = function(req, res, next) {
  var authorization = req.headers.authorization;
  var sanitizedAuthorization = authorization && req.headers.authorization.replace(/^OAuth /, "").replace(/,\s+/g, ",");
  var tokens = _.reduce(sanitizedAuthorization ? sanitizedAuthorization.split(",") : [], function(tokens, pair) {
    var splitted = pair.split("=");
    tokens[splitted[0]] = splitted[1].replace(/^"(.*)"$/, "$1");
    return tokens;
  }, {});

  var consumer = connections[tokens.oauth_consumer_key];
  var connection = consumer && consumer.tokens[tokens.oauth_token];
  var signature = connection && consumer.oauth_consumer_secret + "&" + connection.oauth_token_secret;

  if(connection && tokens.oauth_signature == signature) {
    req.userId = connection.userId;
    next();
  }
  else {
    res.status(401).json({"id":2001,"message":"Not connected","type":"error"});
  }
};
