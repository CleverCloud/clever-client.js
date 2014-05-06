if(typeof CleverAPI == "undefined") {
  CleverAPI = require("../clever-client.js");
}

var api = CleverAPI({
  API_AUTHORIZATION: 'OAuth realm="http://ccapi.cleverapps.io/v2/oauth", oauth_consumer_key="X2tBhWFUc9GQKUujBTd11SHYPEqwF5", oauth_token="0e052c7539724f249ad7204adc085857", oauth_signature_method="PLAINTEXT", oauth_signature="3qBrT7K1DKzll7MnRHLDiAxMEqhwqu&88b19258e86b42809eaafaf9b1d2ee46", oauth_timestamp="1398409072", oauth_nonce="830970"',
  API_HOST: "http://127.0.0.1:8080/v2"
});

describe("Addon.get", function() {
  it("should be able to get addon information", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});

describe("Addon.getAll", function() {
  it("should be able to get the addons of a given owner", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});

describe("Addon.changePlan", function() {
  it("should be able to change plan for an addon", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});

describe("Addon - provision and remove", function() {
  it("should be able to provision an addon, then remove it", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});

describe("Addon.getSSOData", function() {
  it("should be able to get the SSO data of a given addon", function(done) {
    console.log("TODO: addon aren't stable on the test API atm");
    done();
  });
});
