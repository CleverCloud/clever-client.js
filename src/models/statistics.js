function initializeStatistics(client, settings) {
  var Statistics = {};

  Statistics.getCredits = function(orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.credits.get.apply(client, params)();
  };

  Statistics.getConsumptions = function(options, orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.credits.history.get.apply(client, params)({query: options});
  };

  Statistics.getConsumptionsByAppAndByDate = function(price, consumptions) {
    var startOfDay = function(timestamp) {
      var day = new Date(timestamp);
      return new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    };

    return _.foldl(consumptions, function(consumptionsByAppAndByDate, consumption) {
      var cc = consumptionsByAppAndByDate;
      var date = startOfDay(consumption.date);

      cc[consumption.appId] = cc[consumption.appId] || {};
      cc[consumption.appId][date] = (cc[consumption.appId][date] || 0) - consumption.delta * price.value;

      return cc;
    }, {});
  };

  return Statistics;
}
