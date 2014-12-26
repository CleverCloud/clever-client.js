module.exports = function(client) {
  var userId = "user_6058cc02-0728-4364-8217-c775e7c43eee";

  describe("owner", function() {
    it("should be able to retrieve user information", function(done) {
      var req = client.owner().get().send();

      req.onValue(function(user) {
        expect(user.id).toBe(userId);
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });

    it("should be able to retrieve user information with a given ownerId", function(done) {
      var req = client.owner(userId).get().send();

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
