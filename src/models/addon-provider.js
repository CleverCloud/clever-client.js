function initializeAddonProvider(client, settings) {
  var AddonProvider = {};

  AddonProvider.getAll = function() {
    return client.addons.providers.get()();
  };

  AddonProvider.get = function(providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId] : [providerId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.get.apply(client, params)();
  };

  AddonProvider.update = function(provider, orgaId) {
    var params = orgaId ? [orgaId, provider.id] : [provider.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.put.apply(client, params)(JSON.stringify(provider));
  };

  AddonProvider.getPlans = function(providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId] : [providerId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.plans.get.apply(client, params)();
  };

  AddonProvider.editPlan = function(plan, providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId, plan.id] : [providerId, plan.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.plans._.put.apply(client, params)(JSON.stringify(plan));
  };

  AddonProvider.addPlan = function(plan, providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId] : [providerId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.plans.post.apply(client, params)(JSON.stringify(plan));
  };

  AddonProvider.removePlan = function(planId, providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId, planId] : [providerId, planId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.plans._.remove.apply(client, params)();
  };

  AddonProvider.getFeatures = function(providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId] : [providerId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.features.get.apply(client, params)();
  };

  AddonProvider.addFeature = function(feature, providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId] : [providerId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.features.post.apply(client, params)(JSON.stringify(feature));
  };

  AddonProvider.removeFeature = function(featureId, providerId, orgaId) {
    var params = orgaId ? [orgaId, providerId, encodeURIComponent(btoa(featureId))] : [providerId, encodeURIComponent(btoa(featureId))];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.addonproviders._.features._.remove.apply(client, params)();
  };

  return AddonProvider;
}
