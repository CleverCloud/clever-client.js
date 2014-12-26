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

    it("should be able to update user information", function(done) {
      var req = client.self.put().send(JSON.stringify({
        "firstName": "Ahmad",
        "lastName": "Jamal",
        "phone": "0504030201",
        "address": "11, rue Pierre Landais",
        "city": "Nantes",
        "zipcode": "44300",
        "country": "FRANCE"
      }));

      req.onValue(function(user) {
        expect(user.firstName).toBe("Ahmad");
        expect(user.lastName).toBe("Jamal");
        expect(user.phone).toBe("0504030201");
        done();
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });
  });
};
