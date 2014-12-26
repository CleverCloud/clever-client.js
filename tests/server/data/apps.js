var _ = require("lodash");
var flavors = require("./flavors.js");

module.exports = {
  "app_da86bf81-bff2-4eaa-9f70-9adc660e1e4a": {
    "id": "app_da86bf81-bff2-4eaa-9f70-9adc660e1e4a",
    "name": "Thing of Gold",
    "description": "Thing of Gold",
    "zone": "par",
    "instance": {
      "type": "node",
      "version": 83,
      "minInstances": 1,
      "maxInstances": 2,
      "maxAllowedInstances": 40,
      "minFlavor": flavors.S,
      "maxFlavor": flavors.M,
      "flavors": _.values(flavors)
    },
    "deployment": {
      "shutdownable": false,
      "type": "GIT"
    },
    "vhosts": [{
      "fqdn": "thing-of-gold.cleverapps.io"
    }, {
      "fqdn": "app-da86bf81-bff2-4eaa-9f70-9adc660e1e4a.cleverapps.io"
    }],
    "deployUrl": "git+ssh://git@push.par.clever-cloud.com/app_da86bf81-bff2-4eaa-9f70-9adc660e1e4a.git",
    "creationDate": 1419602512298,
    "tags": ["ground-up"],
    "last_deploy": 12,
    "archived": false,
    "stickySessions": false,
    "homogeneous": false,
    "webhookUrl": null,
    "webhookSecret": null
  },
  "app_1918413f-6790-420b-9c91-7af6341e2a37": {
    "id": "app_1918413f-6790-420b-9c91-7af6341e2a37",
    "name": "Minjor",
    "description": "Minjor",
    "zone": "par",
    "instance": {
      "type": "node",
      "version": 83,
      "minInstances": 1,
      "maxInstances": 2,
      "maxAllowedInstances": 40,
      "minFlavor": flavors.S,
      "maxFlavor": flavors.M,
      "flavors": _.values(flavors)
    },
    "deployment": {
      "shutdownable": false,
      "type": "GIT"
    },
    "vhosts": [{
      "fqdn": "minjor.cleverapps.io"
    }, {
      "fqdn": "app-1918413f-6790-420b-9c91-7af6341e2a37.cleverapps.io"
    }],
    "deployUrl": "git+ssh://git@push.par.clever-cloud.com/app_1918413f-6790-420b-9c91-7af6341e2a37.git",
    "creationDate": 1419611111117,
    "tags": ["ground-up"],
    "last_deploy": 12,
    "archived": false,
    "stickySessions": false,
    "homogeneous": false,
    "webhookUrl": null,
    "webhookSecret": null
  }
};
