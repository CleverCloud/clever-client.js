//Consumer key: X2tBhWFUc9GQKUujBTd11SHYPEqwF5
//Consumer secret: 3qBrT7K1DKzll7MnRHLDiAxMEqhwqu

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
