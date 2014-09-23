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
    console.log("TODO: handle braintree token in tests");
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
