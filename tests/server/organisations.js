var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");

var router = module.exports = express.Router();

var organisations = require("./data/organisations.js");

router.use(bodyParser.json());

router.use(["/organisations", "/organisations/:orgaId"], require("./authorization.js"));

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

router.get("/organisations", function(req, res, next) {
  var userId = req.query.user;

  if(userId != req.userId) {
    res.status(401).json({type: "error", message: "You cannot access the organisations of user(" + userId + ")"});
  }
  else {
    var orgas = _.filter(organisations, function(orga) {
      return _.any(orga.members, function(member) {
        return member.member.id == userId;
      });
    });

    res.json(orgas);
  }
});

router.get("/organisations/:orgaId", function(req, res, next) {
  var member = _.find(req.orga.members, function(member) {
    return member.member.id == req.userId;
  });

  if(member) {
    res.json(req.orga);
  }
  else {
    res.status(401).json({type: "error", message: "You cannot access the organisation " + req.param.orgaId});
  }
});
