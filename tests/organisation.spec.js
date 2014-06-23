if(typeof CleverAPI == "undefined") {
  CleverAPI = require("../dist/clever-client.js");
}

var api = CleverAPI({
  API_AUTHORIZATION: 'OAuth realm="http://ccapi.cleverapps.io/v2/oauth", oauth_consumer_key="X2tBhWFUc9GQKUujBTd11SHYPEqwF5", oauth_token="0e052c7539724f249ad7204adc085857", oauth_signature_method="PLAINTEXT", oauth_signature="3qBrT7K1DKzll7MnRHLDiAxMEqhwqu&88b19258e86b42809eaafaf9b1d2ee46", oauth_timestamp="1398409072", oauth_nonce="830970"',
  API_HOST: "http://127.0.0.1:8080/v2"
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
