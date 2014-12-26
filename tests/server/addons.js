var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");

var router = module.exports = express.Router();

var users = require("./data/users.js");
var organisations = require("./data/organisations.js");

router.use(bodyParser.json());

router.use([
  "/self/addons",
  "/self/addons/:addonId",
  "/organisations/:orgaId/addons",
  "/organisations/:orgaId/addons/:addonId"
  ], require("./authorization.js"));

router.param("orgaId", function(req, res, next, orgaId) {
  var orga = organisations[orgaId];

  if(orga) {
    req.orga = orga;
    next();
  }
  else {
    res.status(404).json({type: "error", message: "Organisation not found"});
  }
});

router.param("addonId", function(req, res, next, addonId) {
  var owner = req.orga || users[req.userId];
  var addon = _.find(owner.addons, function(addon) {
    return addon.id == addonId;
  });

  if(addon) {
    req.addon = addon;
    next();
  }
  else {
    res.status(404).json({type: "error", message: "Addon not found"});
  }
});

router.get("/self/addons", function(req, res, next) {
  var user = users[req.userId];
  res.json(user.addons);
});

router.get("/self/addons/:addonId", function(req, res, next) {
  res.json(req.addon);
});

router.get("/organisations/:orgaId/addons", function(req, res, next) {
  res.json(req.orga.addons);
});

router.get("/organisations/:orgaId/addons/:addonId", function(req, res, next) {
  res.json(req.addon);
});
