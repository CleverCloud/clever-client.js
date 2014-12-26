var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");

var router = module.exports = express.Router();

var users = require("./data/users.js");
var organisations = require("./data/organisations.js");

router.use(bodyParser.json());

router.use([
  "/self/applications",
  "/self/applications/:appId",
  "/organisations/:orgaId/applications",
  "/organisations/:orgaId/applications/:appId"
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

router.param("appId", function(req, res, next, appId) {
  var owner = req.orga || users[req.userId];
  var app = _.find(owner.apps, function(app) {
    return app.id == appId;
  });

  if(app) {
    req.app = app;
    next();
  }
  else {
    res.status(404).json({type: "error", message: "App not found"});
  }
});

router.get("/self/applications", function(req, res, next) {
  var user = users[req.userId];
  res.json(user.apps);
});

router.get("/self/applications/:appId", function(req, res, next) {
  res.json(req.app);
});

router.get("/organisations/:orgaId/applications", function(req, res, next) {
  res.json(req.orga.apps);
});

router.get("/organisations/:orgaId/applications/:appId", function(req, res, next) {
  res.json(req.app);
});
