if(typeof CleverAPI == "undefined") {
  CleverAPI = require("../dist/clever-client.js");
}

var api = CleverAPI({
  API_AUTHORIZATION: 'OAuth realm="http://ccapi.cleverapps.io/v2/oauth", oauth_consumer_key="X2tBhWFUc9GQKUujBTd11SHYPEqwF5", oauth_token="0e052c7539724f249ad7204adc085857", oauth_signature_method="PLAINTEXT", oauth_signature="3qBrT7K1DKzll7MnRHLDiAxMEqhwqu&88b19258e86b42809eaafaf9b1d2ee46", oauth_timestamp="1398409072", oauth_nonce="830970"',
  API_HOST: "http://127.0.0.1:8080/v2"
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
