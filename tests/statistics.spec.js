if(typeof CleverAPI == "undefined") {
  CleverAPI = require("../clever-client.js");
}

if(typeof consumptionDump == "undefined") {
  consumptionDump = require("./consumption-dump.js");
}

var api = CleverAPI({
  API_AUTHORIZATION: 'OAuth realm="http://ccapi.cleverapps.io/v2/oauth", oauth_consumer_key="X2tBhWFUc9GQKUujBTd11SHYPEqwF5", oauth_token="0e052c7539724f249ad7204adc085857", oauth_signature_method="PLAINTEXT", oauth_signature="3qBrT7K1DKzll7MnRHLDiAxMEqhwqu&88b19258e86b42809eaafaf9b1d2ee46", oauth_timestamp="1398409072", oauth_nonce="830970"',
  API_HOST: "http://127.0.0.1:8080/v2"
});

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
