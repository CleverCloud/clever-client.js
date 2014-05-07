function initializeAddon(client, settings) {
  var Addon = {};

  Addon.getPlanFeaturesDescription = function(plan) {
    return _.chain(plan.features).sortBy('name').map(function(feature) {
      return feature.name + "=" + feature.value;
    }).value().join(', ');
  };

  Addon.getAll = function(orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons.get.apply(client, params)();
  };

  Addon.provision = function(information, providerId, planId, paymentToken, orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons.post.apply(client, params)(JSON.stringify({
      name: information.name,
      providerId: providerId,
      plan: planId,
      payment: paymentToken
    }));
  };

  Addon.get = function(addonId, orgaId) {
    var params = orgaId ? [orgaId, addonId] : [addonId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons._.get.apply(client, params)();
  };

  Addon.changePlan = function(addon, orgaId) {
    var params = orgaId ? [orgaId, addon.id] : [addon.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons._.put.apply(client, params)(JSON.stringify(addon));
  };

  Addon.remove = function(addonId, orgaId) {
    var params = orgaId ? [orgaId, addonId] : [addonId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons._.remove.apply(client, params)();
  };

  Addon.getSSOData = function(addonId, orgaId) {
    var params = orgaId ? [orgaId, addonId] : [addonId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons._.sso.get.apply(client, params)();
  };

  Addon.getLinkedApplications = function(addonId, orgaId) {
    var params = orgaId ? [orgaId, addonId] : [addonId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addons._.applications.get.apply(client, params)();
  };

  return Addon;
}
