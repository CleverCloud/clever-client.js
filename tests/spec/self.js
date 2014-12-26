module.exports = function(client) {
  var userId = "user_c27c26e4-bf7b-4835-8df7-6472dc25cfdb";

  describe("self", function() {
    it("should be able to retrieve user information", function(done) {
      var req = client.self.get().send();

      req.onValue(function(user) {
        expect(user.id).toBe(userId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });
  });
};
