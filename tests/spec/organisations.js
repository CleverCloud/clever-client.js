module.exports = function(client) {
  var userId = "user_c27c26e4-bf7b-4835-8df7-6472dc25cfdb";
  var orgaId = "orga_5a58bf40-3fd6-47b2-adec-41d43becef8d";

  describe("organisations", function() {
    it("should be able to retrieve user organisations", function(done) {
      var req = client.organisations.get().withQuery({user: userId}).send();

      req.onValue(function(orgas) {
        expect(orgas[0].id).toBe(orgaId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });

    it("should be able to retrieve a specific organisation", function(done) {
      var req = client.organisations._.get().withParams([orgaId]).send();

      req.onValue(function(orga) {
        expect(orga.id).toBe(orgaId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });
  });
};
