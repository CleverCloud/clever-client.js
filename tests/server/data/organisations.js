var users = require("./users.js");
var apps = require("./apps.js");
var addons = require("./addons.js");
var providers = require("./providers.js");

var mleague = users["user_c27c26e4-bf7b-4835-8df7-6472dc25cfdb"];

module.exports = {
  "orga_5a58bf40-3fd6-47b2-adec-41d43becef8d": {
    "id": "orga_5a58bf40-3fd6-47b2-adec-41d43becef8d",
    "name": "Snarky Puppy",
    "description": "Snarky Puppy",
    "address": "2, B Street",
    "city": "B",
    "zipcode": "B",
    "country": "UNITED STATES",
    "company": null,
    "VAT": null,
    "avatar": "http://www.anteprimaproductions.com/local/cache-vignettes/L300xH300/319d55e1e04191979f7504db9b39d640-40ebd.png",
    "vatState": "INVALID",
    "members": [{
      "member": {
        "id": mleague.id,
        "email": mleague.email,
        "name": mleague.name,
        "avatar": mleague.avatar
      },
      "role": "ADMIN",
      "job": "Band leader"
    }],
    "apps": [
      apps["app_1918413f-6790-420b-9c91-7af6341e2a37"]
    ],
    "addons": [
      addons["postgresql_postgres_8871e40f-3ae9-4ced-a391-ae8f956512da"]
    ],
    "providers": [
      providers["postgresql-addon"]
    ]
  }
};
