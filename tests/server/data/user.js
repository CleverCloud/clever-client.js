module.exports = {
  "id": "user_6058cc02-0728-4364-8217-c775e7c43eee",
  "email": "dave.brubeck@clever-cloud.com",
  "firstName": "Dave",
  "lastName": "Brubeck",
  "phone": "0102030405",
  "address": "11, rue Pierre Landais",
  "city": "Nantes",
  "zipcode": "44200",
  "country": "FRANCE",
  "apps": [{
    "id": "app_2e26c3e0-e929-4616-82aa-ffa91e003103",
    "name": "Blue Rondo a la Turk",
    "description": "Time Out (1959)",
    "zone": "par",
    "instance": {
      "type": "node",
      "version": 61,
      "minInstances": 1,
      "maxInstances": 2,
      "minFlavor": {
        "name": "S",
        "mem": 2048,
        "cpus": 2,
        "disk": null,
        "price": 0.6873
      },
      "maxFlavor": {
        "name": "M",
        "mem": 4096,
        "cpus": 4,
        "disk": null,
        "price": 1.7182
      },
      "flavors": [{
        "name": "Solo",
        "mem": 768,
        "cpus": 1,
        "disk": null,
        "price": 0.3436
      }, {
        "name": "S",
        "mem": 2048,
        "cpus": 2,
        "disk": null,
        "price": 0.6873
      }, {
        "name": "M",
        "mem": 4096,
        "cpus": 4,
        "disk": null,
        "price": 1.7182
      }, {
        "name": "L",
        "mem": 8192,
        "cpus": 6,
        "disk": null,
        "price": 3.4364
      }, {
        "name": "XL",
        "mem": 16384,
        "cpus": 8,
        "disk": null,
        "price": 6.8729
      }]
    },
    "deployment": {
      "shutdownable": false,
      "type": "GIT"
    },
    "vhosts": [{
      "secure": null,
      "fqdn": "app-2e26c3e0-e929-4616-82aa-ffa91e003103.cleverapps.io",
      "path": null,
      "address": null
    }, {
      "secure": null,
      "fqdn": "blue-rondo.cleverapps.io",
      "path": null,
      "address": null
    }],
    "deployUrl": "git+ssh://git@push.par.clever-cloud.com/app_2e26c3e0-e929-4616-82aa-ffa91e003103.git",
    "creationDate": 1406723536419,
    "tags": [],
    "last_deploy": 6,
    "deployments": [{
      "id": 1,
      "date": 1406723714228,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0272a674d9e722261de07a93f1e88b832a0e8223",
      "cause": "Git"
    }, {
      "id": 2,
      "date": 1406723996843,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0272a674d9e722261de07a93f1e88b832a0e8223",
      "cause": "Monitoring"
    }, {
      "id": 3,
      "date": 1406724237131,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0272a674d9e722261de07a93f1e88b832a0e8223",
      "cause": "Monitoring"
    }, {
      "id": 4,
      "date": 1406724537607,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0272a674d9e722261de07a93f1e88b832a0e8223",
      "cause": "Monitoring"
    }, {
      "id": 5,
      "date": 1406724777323,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0272a674d9e722261de07a93f1e88b832a0e8223",
      "cause": "Monitoring"
    }, {
      "id": 6,
      "date": 1406725017496,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0272a674d9e722261de07a93f1e88b832a0e8223",
      "cause": "Monitoring"
    }],
    "archieved": false,
    "stickySessions": false
  }, {
    "id": "app_35f5e39c-f524-4a4e-ba72-6436dba39c02",
    "name": "Swannee River",
    "description": "Gone with the Wind (1956)",
    "zone": "mtl",
    "instance": {
      "type": "node",
      "version": 61,
      "minInstances": 1,
      "maxInstances": 40,
      "minFlavor": {
        "name": "S",
        "mem": 2048,
        "cpus": 2,
        "disk": null,
        "price": 0.6873
      },
      "maxFlavor": {
        "name": "S",
        "mem": 2048,
        "cpus": 2,
        "disk": null,
        "price": 0.6873
      },
      "flavors": [{
        "name": "Solo",
        "mem": 768,
        "cpus": 1,
        "disk": null,
        "price": 0.3436
      }, {
        "name": "S",
        "mem": 2048,
        "cpus": 2,
        "disk": null,
        "price": 0.6873
      }, {
        "name": "M",
        "mem": 4096,
        "cpus": 4,
        "disk": null,
        "price": 1.7182
      }, {
        "name": "L",
        "mem": 8192,
        "cpus": 6,
        "disk": null,
        "price": 3.4364
      }, {
        "name": "XL",
        "mem": 16384,
        "cpus": 8,
        "disk": null,
        "price": 6.8729
      }]
    },
    "deployment": {
      "shutdownable": false,
      "type": "GIT"
    },
    "vhosts": [{
      "secure": null,
      "fqdn": "app-35f5e39c-f524-4a4e-ba72-6436dba39c02.cleverapps.io",
      "path": null,
      "address": null
    }, {
      "secure": null,
      "fqdn": "swannee-river.cleverapps.io",
      "path": null,
      "address": null
    }],
    "deployUrl": "git+ssh://git@push.mtl.clever-cloud.com/app_35f5e39c-f524-4a4e-ba72-6436dba39c02.git",
    "creationDate": 1400779571202,
    "tags": [],
    "last_deploy": 5,
    "deployments": [{
      "id": 1,
      "date": 1400779670013,
      "state": "FAIL",
      "action": "DEPLOY",
      "commit": "46d28125aca2970cfeaa67fe8365018a4f574e07",
      "cause": "Git"
    }, {
      "id": 2,
      "date": 1400780026916,
      "state": "FAIL",
      "action": "DEPLOY",
      "commit": "455bb76e4243619e2dc2bb6f858e504b32fbbf78",
      "cause": "Git"
    }, {
      "id": 3,
      "date": 1400780501005,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0424ee90a8662b6ac86355ee8aac9be7e2e08ea1",
      "cause": "Git"
    }, {
      "id": 4,
      "date": 1400780708816,
      "state": "OK",
      "action": "UNDEPLOY",
      "commit": null,
      "cause": "Console (production)"
    }, {
      "id": 5,
      "date": 1406724073923,
      "state": "OK",
      "action": "DEPLOY",
      "commit": "0424ee90a8662b6ac86355ee8aac9be7e2e08ea1",
      "cause": "Console (production)"
    }],
    "archieved": false,
    "stickySessions": false
  }],
  "creationDate": 1357135478248,
  "addons": [{
    "id": "postgresql_607",
    "name": null,
    "realId": "postgresql_607",
    "region": "eu",
    "tags": [],
    "provider": {
      "id": "postgresql-addon",
      "name": "PostgreSQL",
      "website": "http://www.clever-cloud.com",
      "supportEmail": "support@clever-cloud.com",
      "googlePlusName": "",
      "twitterName": "",
      "analyticsId": "",
      "shortDesc": "Postgresql as a service, provided by Clever Cloud.",
      "longDesc": "Wanna add an addon to your Clever Cloud account? Want it to be a postgresql database? This is for you!",
      "logoUrl": "https://cleverstatic.cleverapps.io/addon-providers/postgresql-addon.png",
      "plans": [{
        "id": "plan_d2ada71a-aa8e-4ead-8cb9-28314664437e",
        "name": "DEV",
        "slug": "dev",
        "price": 0,
        "features": [{
          "name": "Max DB size",
          "type": "FILESIZE",
          "value": "256 MB"
        }, {
          "name": "Memory",
          "type": "FILESIZE",
          "value": "Shared"
        }, {
          "name": "Max connection limit",
          "type": "NUMBER",
          "value": "2"
        }]
      }, {
        "id": "plan_8b8be8bf-a95d-4486-9943-c08a16599d86",
        "name": "S",
        "slug": "s",
        "price": 10,
        "features": [{
          "name": "vCPUS",
          "type": "NUMBER",
          "value": "-"
        }, {
          "name": "Memory",
          "type": "FILESIZE",
          "value": "Shared"
        }, {
          "name": "Max connection limit",
          "type": "NUMBER",
          "value": "10"
        }, {
          "name": "Max DB size",
          "type": "FILESIZE",
          "value": "1 GB"
        }]
      }, {
        "id": "plan_4e4cdf25-dbac-4d33-b5b9-7b7d76872819",
        "name": "L",
        "slug": "l",
        "price": 240,
        "features": [{
          "name": "Max DB size",
          "type": "FILESIZE",
          "value": "450 GB"
        }, {
          "name": "Max connection limit",
          "type": "NUMBER",
          "value": "500"
        }, {
          "name": "Memory",
          "type": "FILESIZE",
          "value": "8 GB"
        }]
      }, {
        "id": "plan_fd1ce031-04c2-439a-bdff-412e54bace5b",
        "name": "M",
        "slug": "m",
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
      }],
      "features": [{
        "name": "Max DB size",
        "type": "FILESIZE"
      }, {
        "name": "Memory",
        "type": "FILESIZE"
      }, {
        "name": "vCPUS",
        "type": "NUMBER"
      }, {
        "name": "Max connection limit",
        "type": "NUMBER"
      }],
      "status": "BETA_PUB",
      "tags": ["db", "sql", "data", "postgresql", "postgre", "database", "pgsql", "rdbms"],
      "regions": ["eu", "us"]
    },
    "plan": {
      "id": "plan_d2ada71a-aa8e-4ead-8cb9-28314664437e",
      "name": "DEV",
      "slug": "dev",
      "price": 0,
      "features": [{
        "name": "Max DB size",
        "type": "FILESIZE",
        "value": "256 MB"
      }, {
        "name": "Memory",
        "type": "FILESIZE",
        "value": "Shared"
      }, {
        "name": "Max connection limit",
        "type": "NUMBER",
        "value": "2"
      }]
    },
    "creationDate": 0,
    "configKeys": ["POSTGRESQL_ADDON_USER", "POSTGRESQL_ADDON_PASSWORD", "POSTGRESQL_ADDON_DB", "POSTGRESQL_ADDON_HOST"]
  }],
  "emailValidated": true
};
