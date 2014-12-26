var _ = require("lodash");

var plans = [{
  "id": "plan_05ecc711-0250-43de-b8d7-41b47fec05b1",
  "name": "DEV",
  "slug": "dev",
  "price": 0,
  "features": [{
    "name": "Memory",
    "type": "FILESIZE",
    "value": "Shared"
  }, {
    "name": "Max DB size",
    "type": "FILESIZE",
    "value": "256 MB"
  }, {
    "name": "Max connection limit",
    "type": "NUMBER",
    "value": "5"
  }]
}, {
  "id": "plan_c5d46702-ab35-4937-87a8-ddff472a32d8",
  "name": "PRO",
  "slug": "pro",
  "price": 30,
  "features": [{
    "name": "Memory",
    "type": "FILESIZE",
    "value": "1 GB"
  }, {
    "name": "Max DB size",
    "type": "FILESIZE",
    "value": "100 GB"
  }, {
    "name": "Max connection limit",
    "type": "NUMBER",
    "value": "75"
  }]
}];

module.exports = {
  "postgresql-addon": {
    "id": "postgresql-addon",
    "name": "PostgreSQL",
    "website": "http://www.clever-cloud.com",
    "supportEmail": "support@clever-cloud.com",
    "googlePlusName": "",
    "twitterName": "",
    "analyticsId": "",
    "shortDesc": "A powerful, open source object-relational database system",
    "longDesc": "Wanna add an addon to your Clever Cloud account? Want it to be a postgresql database? This is for you!",
    "logoUrl": "https://cleverstatic.cleverapps.io/addon-providers/postgresql-addon.png",
    "plans": plans,
    "features": _.omit(_.first(plans).features, "value"),
    "status": "BETA_PUB",
    "tags": ["db", "database", "sql", "pg", "postgresql"],
    "regions": ["eu", "us"]
  }
};
