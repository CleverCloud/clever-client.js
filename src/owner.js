var Owner = (function() {
  var Owner = function(client, settings) {
    var owner = function(ownerId) {
      return ownerId && ownerId.indexOf("orga_") == 0 ? client.organisations._ : client.self;
    };

    return owner;
  };

  return Owner;
})();
