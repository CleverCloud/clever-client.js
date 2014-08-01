var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");
var checkAuthorization = require("./authorization.js").checkAuthorization;

var router = module.exports = express.Router();

router.use(bodyParser.json());

router.get("/self", checkAuthorization(function(req, res, next) {
  var user = require("./data/user.js");

  res.json(user);
}));

router.put("/self", checkAuthorization(function(req, res, next) {
  var user = require("./data/user.js");

  var updatedUser = _.chain(req.body)
    .pick(function(value, field) {
      return ["firstName", "lastName", "phone", "address", "city", "zipcode", "country"].indexOf(field) >= 0;
    })
    .defaults(user)
    .value();

  res.json(updatedUser);
}));
