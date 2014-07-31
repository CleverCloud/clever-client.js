module.exports = function(client) {
  var userId = "user_6058cc02-0728-4364-8217-c775e7c43eee";

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

    it("should cache user information in a property", function(done) {
      var req = client.self.get().send();
      var s_user = client.self.asProperty();

      s_user.onValue(function(user) {
        expect(user.id).toBe(userId);
        done();
      });

      s_user.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });
  });
};
