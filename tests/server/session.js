var express = require("express");
var bodyParser = require("body-parser");
var querystring = require("querystring");

var router = module.exports = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.post("/oauth/request_token", function(req, res, next) {
  if(req.body.oauth_consumer_key == "aaaa" && req.body.oauth_signature == "bbbb&") {
    res.send(new Buffer(querystring.stringify({
      oauth_token: "cccc",
      oauth_token_secret: "dddd",
      oauth_callback_confirmed: true
    }).toString("base64")));
  }
  else {
    res.send(404, "consumer not found");
  }
});

router.get("/oauth/authorize", function(req, res, next) {
  if(req.query.oauth_token == "cccc") {
    res.redirect(303, "http://127.0.0.1:1234/tests/session/?" + querystring.stringify({
      oauth_token: req.query.oauth_token,
      oauth_verifier: "eeee"
    }));
  }
  else {
    res.json(400, {id: "1503", message: "Your oauth token has expired, please re authenticate", type: "error"});
  }
});

router.post("/oauth/access_token", function(req, res, next) {
  if(req.body.oauth_token == "cccc"
  && req.body.oauth_consumer_key == "aaaa"
  && req.body.oauth_verifier == "eeee"
  && req.body.oauth_signature == "bbbb&dddd"
  ) {
    res.send(new Buffer(querystring.stringify({
      oauth_token: "ffff",
      oauth_token_secret: "gggg"
    }).toString("base64")));
  }
  else {
    res.send(400, "invalid value for oauth_token, oauth_consumer_key, oauth_verifier or oauth_signature");
  }
});
