var _ = require("lodash");
var providers = require("./providers.js");

module.exports = {
  "postgresql_postgres_23b98d9d-4529-4711-8877-aadb9273636b": {
    "id": "postgresql_postgres_23b98d9d-4529-4711-8877-aadb9273636b",
    "name": "Bent Nails",
    "realId": "postgresql_postgres_23b98d9d-4529-4711-8877-aadb9273636b",
    "region": "eu",
    "tags": ["ground-up", "europe"],
    "provider": providers["postgresql-addon"],
    "plan": _.find(providers["postgresql-addon"].plans, function(plan) { return plan.name == "DEV"; }),
    "creationDate": 1419604508266,
    "configKeys": ["POSTGRESQL_ADDON_DB", "POSTGRESQL_ADDON_HOST", "POSTGRESQL_ADDON_USER", "POSTGRESQL_ADDON_PASSWORD"]
  },
  "postgresql_postgres_8871e40f-3ae9-4ced-a391-ae8f956512da": {
    "id": "postgresql_postgres_8871e40f-3ae9-4ced-a391-ae8f956512da",
    "name": "Binky",
    "realId": "postgresql_postgres_8871e40f-3ae9-4ced-a391-ae8f956512da",
    "region": "eu",
    "tags": ["ground-up", "europe"],
    "provider": providers["postgresql-addon"],
    "plan": _.find(providers["postgresql-addon"].plans, function(plan) { return plan.name == "PRO"; }),
    "creationDate": 1419611273655,
    "configKeys": ["POSTGRESQL_ADDON_DB", "POSTGRESQL_ADDON_HOST", "POSTGRESQL_ADDON_USER", "POSTGRESQL_ADDON_PASSWORD"]
  }
};
