var express = require("express");
var checkAuthorization = require("./authorization.js").checkAuthorization;

var router = module.exports = express.Router();

router.get("/self", checkAuthorization(function(req, res, next) {
  var user = require("./data/user.js");

  res.json(user);
}));
