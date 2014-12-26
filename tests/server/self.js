var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");

var router = module.exports = express.Router();

router.use(bodyParser.json());

router.use("/self", require("./authorization.js"));

router.get("/self", function(req, res, next) {
  var user = require("./data/users.js")[req.userId];

  res.json(user);
});

router.put("/self", function(req, res, next) {
  var user = require("./data/users.js")[req.userId];

  var updatedUser = _.chain(req.body)
    .pick(function(value, field) {
      return ["firstName", "lastName", "phone", "address", "city", "zipcode", "country"].indexOf(field) >= 0;
    })
    .defaults(user)
    .value();

  res.json(updatedUser);
});
