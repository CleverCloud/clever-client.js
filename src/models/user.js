function initializeUser(client, settings) {
  var User = {};

  User.get = function() {
    return client.self.get()();
  };

  User.update = function(information) {
    return client.self.put()(JSON.stringify(information));
  };

  User.changePassword = function(oldPassword, newPassword) {
    return client.self.change_password.put()(JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword
    }));
  };

  User.getEmailAddresses = function() {
    return client.self.emails.get()();
  };

  User.addEmailAddress = function(address) {
    return client.self.emails._.put(address)();
  };

  User.removeEmailAddress = function(address) {
    return client.self.emails._.remove(address)();
  };

  User.getSSHKeys = function() {
    return client.self.keys.get()();
  };

  User.addSSHKey = function(name, key) {
    return client.self.keys._.put(encodeURIComponent(name))(JSON.stringify(key));
  };

  User.removeSSHKey = function(name) {
    return client.self.keys._.remove(encodeURIComponent(name))();
  };

  User.getCreditCards = function() {
    return client.self.payments.cards.get()();
  };

  User.getTokens = function() {
    return client.self.tokens.get()();
  };

  User.removeToken = function(token) {
    return client.self.tokens._.remove(token)();
  };

  return User;
}
