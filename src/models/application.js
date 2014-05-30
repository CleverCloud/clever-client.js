function initializeApplication(client, settings) {
  var Application = {};

  Application.create = function(application, orgaId) {
    var params = orgaId ? [orgaId, application.id] : [application.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications.post.apply(client, params)(JSON.stringify(application));
  };

  Application.get = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.get.apply(client, params)();
  };

  Application.edit = function(app, orgaId) {
    var params = orgaId ? [orgaId, app.id] : [app.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.put.apply(client, params)(JSON.stringify(app));
  };

  Application.remove = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.remove.apply(client, params)();
  };

  Application.getVhosts = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.vhosts.get.apply(client, params)();
  };

  Application.addVhost = function(vhost, appId, orgaId) {
    var params = orgaId ? [orgaId, appId, vhost] : [appId, vhost];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.vhosts._.put.apply(client, params)();
  };

  Application.removeVhost = function(vhost, appId, orgaId) {
    var params = orgaId ? [orgaId, appId, vhost.fqdn] : [appId, vhost.fqdn];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.vhosts._.remove.apply(client, params)();
  };

  Application.getInstances = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.instances.get.apply(client, params)();
  };

  Application.redeploy = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.instances.post.apply(client, params)();
  };

  Application.undeploy = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.instances.remove.apply(client, params)();
  };

  Application.getLogs = function(appId, orgaId, timestamp) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.logs.get.apply(client, params)(timestamp ? {query: {since: timestamp}} : null);
  };

  Application.getInstanceIdsFromLogs = function(logs) {
    return _.chain(logs).map(function(log) {
      return log._source["@source_host"];
    }).unique().value();
  };

  Application.getAddons = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.addons.get.apply(client, params)();
  };

  Application.linkAddon = function(appId, addonId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.addons.post.apply(client, params)(JSON.stringify(addonId));
  };

  Application.unlinkAddon = function(appId, addonId, orgaId) {
    var params = orgaId ? [orgaId, appId, addonId] : [appId, addonId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.addons._.remove.apply(client, params)();
  };

  Application.getEnvVariables = function(appId, orgaId) {
    var params = orgaId ? [orgaId, appId] : [appId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.env.get.apply(client, params)();
  };

  Application.setEnvVariable = function(key, value, appId, orgaId) {
    var encodedKey = encodeURIComponent(key.toUpperCase());
    var params = orgaId ? [orgaId, appId, encodedKey] : [appId, encodedKey];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.env._.put.apply(client, params)(JSON.stringify(value));
  };

  Application.removeEnvVariable = function(key, appId, orgaId) {
    var encodedKey = encodeURIComponent(key.toUpperCase());
    var params = orgaId ? [orgaId, appId, encodedKey] : [appId, encodedKey];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.applications._.env._.remove.apply(client, params)();
  };

  return Application;
}
