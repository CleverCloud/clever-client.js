if(typeof CleverAPI == "undefined") {
  CleverAPI = require("../dist/clever-client.js");
}

var api = CleverAPI({
  API_AUTHORIZATION: 'OAuth realm="http://ccapi.cleverapps.io/v2/oauth", oauth_consumer_key="X2tBhWFUc9GQKUujBTd11SHYPEqwF5", oauth_token="9c1f8fc6861f4902a58313b1a65a0e6c", oauth_signature_method="PLAINTEXT", oauth_signature="3qBrT7K1DKzll7MnRHLDiAxMEqhwqu&362f9dafce614000a18d30f01b4dd220", oauth_timestamp="1406205818", oauth_nonce="211849"',
  API_HOST: "http://127.0.0.1:8080/v2"
});


var PROVIDER_ID = "postgresql-addon";
var ORGANISATION_ID = "orga_9491e837-7bb3-4022-82a9-a5ecbb70cd22";

describe("AddonProvider.getAll", function() {
  it("should be able to get all public providers", function(done) {
    var result = api.addonprovider.getAll();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider.get", function() {
  it("should be able to get a provider", function(done) {
    var result = api.addonprovider.get(PROVIDER_ID, ORGANISATION_ID);

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider.update", function() {
  it("should be able to update a provider", function(done) {
    var data = {"id":PROVIDER_ID,
      "name":"Postgresql",
      "website":"",
      "supportEmail":"",
      "googlePlusName":"",
      "twitterName":"",
      "analyticsId":"",
      "shortDesc":"",
      "longDesc":"",
      "logoUrl":"",
      "plans":[{
        "id":"plan_79c58e14-6912-4162-aacc-21a4ad8ccfa4",
        "name":"M",
        "slug":"m",
        "price":0,
        "features":[{
          "name":"foo",
          "type":"BOOLEAN",
          "value":""
        }]
      }],
      "features":[{
        "name":"foo",
        "type":"BOOLEAN"
      }],
      "status":"ALPHA"
    };

    var result = api.addonprovider.update(data, ORGANISATION_ID);

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider.getPlans", function() {
  it("should be able to get plans for a provider", function(done) {
    var result = api.addonprovider.getPlans(PROVIDER_ID, ORGANISATION_ID);

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider.editPlan", function() {
  it("should be able to edit a plan for a provider", function(done) {
    var data = {
      "id":"plan_79c58e14-6912-4162-aacc-21a4ad8ccfa4",
      "name":"M",
      "slug":"m",
      "price":0,
      "features":[{
        "name":"foo",
        "type":"BOOLEAN",
        "value":""
      }]
    };

    var result = api.addonprovider.editPlan(data, PROVIDER_ID, ORGANISATION_ID);

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider plans - create and remove", function() {
  it("should be able to add a plan to a provider, then remove it", function(done) {
    var data = {
      "name":"Test",
      "slug":"test",
      "price":0,
      "features":[{
        "name":"foo",
        "type":"BOOLEAN",
        "value":""
      }]
    };

    var result = api.addonprovider.addPlan(data, PROVIDER_ID, ORGANISATION_ID).chain(function(plan) {
      return api.addonprovider.removePlan(plan.id, PROVIDER_ID, ORGANISATION_ID);
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider.getFeatures", function() {
  it("should be able to get provider features", function(done) {
    var result = api.addonprovider.getFeatures(PROVIDER_ID, ORGANISATION_ID);

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(error.message);
      oncomplete();
    });
  });
});

describe("AddonProvider features - create and remove features", function() {
  it("should be able to add a feature to a provider, then remove it", function(done) {
    console.log("TODO: features removal isn't stable on the test API atm");
    done();
  });
});


describe("Addon.get", function() {
  it("should be able to get addon information", function(done) {
    var result = api.addon.get("addon_88d35988-aa2a-4e40-8dc5-84ef5a9df2f7");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Addon.getAll", function() {
  it("should be able to get the addons of a given owner", function(done) {
    var result = api.addon.getAll();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Addon.changePlan", function() {
  it("should be able to change plan for an addon", function(done) {
    console.log("TODO: ccapi isn't ready yet");
    done();
  });
});

describe("Addon - provision and remove", function() {
  it("should be able to provision an addon, then remove it", function(done) {
    console.log("TODO: handle paymill token in tests");
    done();
  });
});

describe("Addon.getSSOData", function() {
  it("should be able to get the SSO data of a given addon", function(done) {
    var result = api.addon.getSSOData("addon_88d35988-aa2a-4e40-8dc5-84ef5a9df2f7");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Addon.getLinkedApplications", function() {
  it("should be able to get the applications linked to the given addon", function(done) {
    var result = api.addon.getLinkedApplications("addon_88d35988-aa2a-4e40-8dc5-84ef5a9df2f7");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Addon.getTags", function() {
  it("should be able to get the tags of a given addon", function(done) {
    var result = api.addon.getTags("addon_88d35988-aa2a-4e40-8dc5-84ef5a9df2f7");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Addon tags - add and remove", function() {
  it("should be able to add and remove a tag from a given addon", function(done) {
    var result = api.addon.addTag("tag test", "addon_88d35988-aa2a-4e40-8dc5-84ef5a9df2f7").chain(function() {
      return api.addon.removeTag("tag test", "addon_88d35988-aa2a-4e40-8dc5-84ef5a9df2f7");
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});


if(typeof logDump == "undefined") {
  logDump = require("./log-dump.js");
}

describe("Application.get", function() {
  it("should be able to get application information", function(done) {
    var result = api.application.get("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.edit", function() {
  it("should be able to edit application information", function(done) {
    var result = api.application.edit({
      id: "app_be09992d-992a-4571-a3d0-62a11becb899",
      name: "test",
      description: "Application for client tests"
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application - create and remove", function() {
  it("should be able to create and remove an application", function(done) {
    var p_instance = api.products.getInstances().map(function(instances) {
      return _.first(instances);
    });

    var p_data = p_instance.map(function(instance) {
      return {
        "name": "test2",
        "description": "test2",
        "instanceType": instance.type,
        "instanceVersion": instance.version,
        "deploy": _.first(instance.deployments),
        "minInstances": 1,
        "maxInstances": 4,
        "minFlavor": _.first(instance.flavors).name,
        "maxFlavor": _.first(instance.flavors).name
      };
    });

    var result = p_data
      .chain(function(data) {
        return api.application.create(data)
      })
      .chain(function(app) {
        return api.application.remove(app.id);
      });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.getVhosts", function() {
  it("should be able to get application domain names", function(done) {
    var result = api.application.getVhosts("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application domain names - create and remove", function() {
  it("should be able to create and remove application domain names", function(done) {
    var result = api.application.addVhost("test.cleverapps.io", "app_be09992d-992a-4571-a3d0-62a11becb899").chain(function() {
      return api.application.removeVhost({fqdn: "test.cleverapps.io"}, "app_be09992d-992a-4571-a3d0-62a11becb899");
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.getInstances", function() {
  it("should be able to get application instances", function(done) {
    var result = api.application.getInstances("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.redeploy", function() {
  it("should be able to (re)deploy an application", function(done) {
    var result = api.application.redeploy("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.undeploy", function() {
  it("should be able to undeploy an application", function(done) {
    var result = api.application.undeploy("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.getLogs", function() {
  it("should be able to get application logs", function(done) {
    console.log("TODO: Test API can't forward application logs atm");
    done();
  });

  it("should be able to get application logs since yesterday", function(done) {
    console.log("TODO: Test API can't forward application logs atm");
    done();
  });
});

describe("Application.getInstanceIdsFromLogs", function() {
  it("should be able to extract instance ids from logs", function() {
    var result = api.application.getInstanceIdsFromLogs(logDump.hits.hits);
    var expectedResult = [
      "57d4d176-3e50-4c2f-8a2b-ddd581e991d9",
      "59b00b48-14c1-4183-842a-5a5c2d074d2e",
      "7c19f3bd-bba5-40b2-9593-f69768b354c4",
      "9f969862-57a8-4c54-b613-4279fda132fe",
      "e6ccd367-8a50-4659-8983-d88d5bcf492e"
    ];

    expect(_.difference(result, expectedResult).length).toBe(0);
  });
});

describe("Application.getAddons", function() {
  it("should be able to addons linked to the given application", function(done) {
    var result = api.application.getAddons("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application.linkAddon", function() {
  it("should be able to link an addon to the given application", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});

describe("Application.unlinkAddon", function() {
  it("should be able to unlink an addon from the given application", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});

describe("Application.getEnvVariables", function() {
  it("should be able to get the environment variables of a given application", function(done) {
    var result = api.application.getEnvVariables("app_be09992d-992a-4571-a3d0-62a11becb899");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Application environment variables - create and remove", function() {
  it("should be able to addons linked to the given application", function(done) {
    var result = api.application.setEnvVariable("ENV_KEY", "ENV_VALUE", "app_be09992d-992a-4571-a3d0-62a11becb899").chain(function() {
      return api.application.removeEnvVariable("ENV_KEY", "app_be09992d-992a-4571-a3d0-62a11becb899");
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});


describe("Invoice.getAll", function() {
  it("should be able to get all invoices", function(done) {
    var result = api.invoice.getAll();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Invoice.get", function() {
  it("should be able to get an invoice", function(done) {
    var result = api.invoice.get("creditnote_24b87a84-361c-4657-93b0-ca97048e82a71398851774650");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Invoice - buy credits", function() {
  it("should be able to buy credits with credit card", function(done) {
    var paymentPackage = {"currency":"EUR","packageId":1};
    var paymentMethod = {"method":"CREDITCARD","imgUrl":"","title":"Credit card","comingSoon":false};

    var p_invoice = api.invoice.createInvoice(paymentPackage);
    var p_invoiceWithMethod = p_invoice.chain(function(invoice) {
      return api.invoice.choosePaymentMethod(paymentMethod, invoice);
    });

    var p_paymillKey = api.invoice.getPaymillKey();

    console.log("TODO: add paymill client to clever-client.js in order to fully test the payment flow");
    var result = p_invoiceWithMethod.chain(function(invoice) {
      return p_paymillKey;
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});


describe("News.getBlogPosts", function() {
  it("should be able to get posts from Clever-Cloud blog", function(done) {
    var result = api.news.getBlogPosts();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("News.getEngineeringPosts", function() {
  it("should be able to get posts from Clever-Cloud tech blog", function(done) {
    var result = api.news.getEngineeringPosts();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});


describe("Organisation.getAll", function() {
  it("should be able to get user organisations", function(done) {
    var result = api.organisation.getAll("user_24b87a84-361c-4657-93b0-ca97048e82a7");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Organisation.get", function() {
  it("should be able to get user organisations", function(done) {
    var result = api.organisation.get("orga_00ce2b47-f44d-4772-afd0-3f641429a9a0");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Organisation.update", function() {
  it("should be able to update an organisation", function(done) {
    var result = api.organisation.update({
      "id":"orga_00ce2b47-f44d-4772-afd0-3f641429a9a0",
      "name":"devs-tests",
      "description":"devs-tests",
      "address":"",
      "city":"",
      "zipcode":"",
      "country":"",
      "company":null,
      "VAT":null,
      "members":[{
        "member": {
          "id":"user_24b87a84-361c-4657-93b0-ca97048e82a7",
          "email":"devs+tests@clever-cloud.com",
          "firstName":"Dave",
          "lastName":"Test",
          "phone":"0102030405",
          "address":"Somewhere",
          "city":"Somewhere",
          "zipcode":"Somewhere",
          "country":"FRANCE",
          "apps":null,
          "creationDate":1398348737841,
          "addons":null,
          "providers":null,
          "emailValidated":true
        },
        "role":"ADMIN",
        "job":"Admin"
      }],
      "apps":[],
      "addons":[],
      "providers":[]
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Organisation - create and remove", function() {
  it("should be able to create and remove an organisation", function(done) {
    var result = api.organisation.create({name: "devs+tests2", description: "devs+tests2"}).chain(function(orga) {
      return api.organisation.remove(orga.id);
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Organisation.addMember", function() {
  it("should be able to add a member to an organisation", function(done) {
    var member = {
      email: "devs+tests2@clever-cloud.com",
      role: "ADMIN",
      job: "Admin"
    };

    var result = api.organisation.addMember(member, "orga_00ce2b47-f44d-4772-afd0-3f641429a9a0");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});


describe("Products.getInstances", function() {
  it("should be able to get available instance types", function(done) {
    var result = api.products.getInstances();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Products.getPackages", function() {
  it("should be able to get available credit packages", function(done) {
    var result = api.products.getPackages();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Products.getPrices", function() {
  it("should be able to get available prices", function(done) {
    var result = api.products.getPrices();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Products.getCoupon", function() {
  it("should be able to get available prices", function(done) {
    var result = api.products.getCoupon("coupon-test");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Products.getZones", function() {
  it("should be able to get available zones", function(done) {
    var result = api.products.getZones();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});


if(typeof consumptionDump == "undefined") {
  consumptionDump = require("./consumption-dump.js");
}

describe("Statistics.getCredits", function() {
  it("should be able to get remaining credits", function(done) {
    var result = api.statistics.getCredits();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Statistics.getConsumptions", function() {
  it("should be able to get credit consumptions", function(done) {
    var result = api.statistics.getConsumptions({
      type: "consumptions",
      from: 1399240800000,
      to: 1399327199000
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Statistics.getConsumptionsByAppAndByDate", function() {
  it("should be able to aggregate credit consumptions", function() {
    var price = {currency: "EUR", value: 0.0097};
    var result = api.statistics.getConsumptionsByAppAndByDate(price, consumptionDump);

    expect(result["app_35ac0ed3-7972-409b-bb67-e6eb00a6cbab"]["1398722400000"]).toBeCloseTo(0.02000043, 0.001);
    expect(result["app_aea63c44-2cc2-4526-9ffe-407e9b31c979"]["1398636000000"]).toBeCloseTo(3.499973400000008, 0.001);
    expect(result["app_aea63c44-2cc2-4526-9ffe-407e9b31c979"]["1398376800000"]).toBeCloseTo(1.5999878399999983, 0.001);
    expect(result["app_aea63c44-2cc2-4526-9ffe-407e9b31c979"]["1398722400000"]).toBeCloseTo(1.6249876499999982, 0.001);
    expect(result["app_aea63c44-2cc2-4526-9ffe-407e9b31c979"]["1398549600000"]).toBeCloseTo(3.5749728300000085, 0.001);
    expect(result["app_aea63c44-2cc2-4526-9ffe-407e9b31c979"]["1398463200000"]).toBeCloseTo(3.5749728300000085, 0.001);
    expect(result["app_1c31e704-1b7e-49b6-8567-c2be028bb89f"]["1398722400000"]).toBeCloseTo(0.0066668100000000004, 0.001);
  });
});


if(typeof Promise == "undefined") {
  Promise = require("pacta");
}

describe("User.get", function() {
  it("should be able to get user information", function(done) {
    var result = api.user.get();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User.update", function() {
  it("should be able to update user information", function(done) {
    var data = {
      firstName: "Dave",
      lastName: "Test",
      phone: "0102030405",
      address: "Somewhere",
      city: "Somewhere",
      zipcode: "Somewhere",
      country: "FRANCE"
    };

    var result = api.user.update(data);

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User.changePassword", function() {
  it("should be able to update user password", function(done) {
    var result = api.user.changePassword("devs+tests", "devs+tests");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User - email addresses", function() {
  it("should be able to get user email addresses", function(done) {
    var result = api.user.getEmailAddresses();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });

  it("should be able to add an email address", function(done) {
    var result = api.user.addEmailAddress("devs+tests+secondary@clever-cloud.com");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });

  it("should be able to remove an email address", function(done) {
    var result = api.user.removeEmailAddress("devs+tests+secondary@clever-cloud.com").chainError(function(error) {
      var p = new Promise();

      /* TODO: error id might change */
      if(error.id == 1001) {
        console.log("Warning: the email address does not seem to exist.");
        p.resolve();
      }
      else {
        p.reject(error);
      }

      return p;
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User - SSH keys", function() {
  it("should be able to get user SSH keys", function(done) {
    var result = api.user.getSSHKeys();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });

  it("should be able to add an SSH key", function(done) {
    var result = api.user.addSSHKey("key", "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCs1LRp/RfUwm91I908CqwgSJv1opTqn/32IfAW+k9ghFOKJh7tjMDEnM69yAmQu0JGaeluZSnUNonsFZ1Ev7/6cLc3fiqxuUMyMW3xZkRQ4Djr8u1/e13Wr3zo7BH05C9cC9+2JrAmSPJRVomEjDjy4YyzDn7zl2puXhBK/viByE8jZ4QvxgnwCW/gIp2vyR9zIbDHb9OH9XDPHp7aw/d54BlLiCOhjvTOA0o8hLLdi4WTHRkFDZ7JrQq485QL3Mbga1r5d+DHMxMZ87upMhe8NOsOEHVSQ+FoK3ET4tLMotStBpkfTX9aHFIzp67cGG7TovDqb+x4qJZ1OZYuqo8F rbelouin@mufasa.local");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });

  it("should be able to remove an SSH key", function(done) {
    var result = api.user.removeSSHKey("key");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User.getCreditCards", function() {
  it("should be able to get user credit cards", function(done) {
    var result = api.user.getCreditCards();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User.getTokens", function() {
  it("should be able to get user connection tokens", function(done) {
    var result = api.user.getTokens();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("User.removeToken", function() {
  it("should be able to remove user connection tokens", function(done) {
    console.log("TODO: no test token is available atm");
    done();
  });
});
