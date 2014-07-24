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
