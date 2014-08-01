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

    it("should cache user information after an edition", function(done) {
      var s_user = client.self.asProperty();
      var req = client.self.put().send(JSON.stringify({
        "firstName": "Dave",
        "lastName": "Brubeck",
        "phone": "0102030405",
        "address": "11, rue Pierre Landais",
        "city": "Nantes",
        "zipcode": "44300",
        "country": "FRANCE"
      }));

      req.onValue(function(user) {
        s_user.onValue(function(cachedUser) {
          expect(user.firstName).toBe(cachedUser.firstName);
          expect(user.lastName).toBe(cachedUser.lastName);
          expect(user.phone).toBe(cachedUser.phone);
          done();
        });
      });

      req.onError(function(error) {
        console.error(JSON.stringify(error));
      });
    });
  });
};
