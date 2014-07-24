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
