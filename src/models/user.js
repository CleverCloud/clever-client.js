function initializeUser(client, settings) {
  var User = {};

  User.get = function() {
    return client.self.get()().map(JSON.parse).mapError(JSON.parse);
  };

  User.update = function(information) {
    return client.self.put()(JSON.stringify(information)).map(JSON.parse).mapError(JSON.parse);
  };

  User.changePassword = function(oldPassword, newPassword) {
    return client.self.change_password.put()(JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword
    })).map(JSON.parse).mapError(JSON.parse);
  };

  User.getEmailAddresses = function() {
    return client.self.emails.get()().map(JSON.parse).mapError(JSON.parse);
  };

  User.addEmailAddress = function(address) {
    return client.self.emails._.put(address)().map(JSON.parse).mapError(JSON.parse);
  };

  User.removeEmailAddress = function(address) {
    return client.self.emails._.remove(address)().map(JSON.parse).mapError(JSON.parse);
  };

  User.getSSHKeys = function() {
    return client.self.keys.get()().map(JSON.parse).mapError(JSON.parse);
  };

  User.addSSHKey = function(name, key) {
    return client.self.keys._.put(encodeURIComponent(name))(JSON.stringify(key)).map(JSON.parse).mapError(JSON.parse);
  };

  User.removeSSHKey = function(name) {
    return client.self.keys._.remove(encodeURIComponent(name))().map(JSON.parse).mapError(JSON.parse);
  };

  return User;
}
