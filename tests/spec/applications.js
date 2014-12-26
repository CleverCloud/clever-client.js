module.exports = function(client) {
  var userId = "user_c27c26e4-bf7b-4835-8df7-6472dc25cfdb";
  var userAppId = "app_da86bf81-bff2-4eaa-9f70-9adc660e1e4a";

  var orgaId = "orga_5a58bf40-3fd6-47b2-adec-41d43becef8d";
  var orgaAppId = "app_1918413f-6790-420b-9c91-7af6341e2a37";

  describe("applications", function() {
    it("should be able to retrieve user applications", function(done) {
      var req = client.self.applications.get().send();

      req.onValue(function(apps) {
        expect(apps[0].id).toBe(userAppId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });

    it("should be able to retrieve a user application", function(done) {
      var req = client.self.applications._.get().withParams([userAppId]).send();

      req.onValue(function(app) {
        expect(app.id).toBe(userAppId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });

    it("should be able to retrieve organisation applications", function(done) {
      var req = client.organisations._.applications.get().withParams([orgaId]).send();

      req.onValue(function(apps) {
        expect(apps[0].id).toBe(orgaAppId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });

    it("should be able to retrieve an organisation application", function(done) {
      var req = client.organisations._.applications._.get().withParams([orgaId, orgaAppId]).send();

      req.onValue(function(app) {
        expect(app.id).toBe(orgaAppId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });
  });
};
