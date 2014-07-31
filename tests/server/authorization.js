var express = require("express");
var _ = require("lodash");

exports.checkAuthorization = function(handler) {
  return function(req, res, next) {
    var authorization = req.headers.authorization;
    var sanitizedAuthorization = authorization && req.headers.authorization.replace(/^OAuth /, "").replace(/,\s+/g, ",");
    var tokens = sanitizedAuthorization && _.foldl(sanitizedAuthorization.split(","), function(tokens, pair) {
      var splitted = pair.split("=");
      tokens[splitted[0]] = splitted[1].replace(/^"(.*)"$/, "$1");
      return tokens;
    }, {});

    if(tokens.oauth_consumer_key == "aaaa"
    && tokens.oauth_token == "ffff"
    && tokens.oauth_signature_method == "PLAINTEXT"
    && tokens.oauth_signature == "bbbb&gggg"
    ) {
      handler(req, res, next);
    }
    else {
      res.status(401).json({"id":2001,"message":"Not connected","type":"error"});
    }
  };
};
