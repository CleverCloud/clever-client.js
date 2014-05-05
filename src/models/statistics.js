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

  Statistics.getTwoWeeksAppConsumptions = function(prices, consumptions) {
    var euros = _.find(prices, function(price) {
      return price.currency == 'EUR';
    });

    var days = _.chain(14).range()
    .map(function(n) {
      return moment().subtract(1+n, "days").startOf("day");
    })
    .sortBy(function(m) {
      return m.toDate();
    })
    .value();

    var consumptionsByDate = function(appConsumptions, appId) {
      var defaultConsumptions = _.foldl(days, function(consumptions, day) {
        consumptions[day.unix()*1000] = 0;
        return consumptions;
      }, {});

      return {
        key: appId,
        values: _.chain(appConsumptions)
        .foldl(function(appConsumptionsByDate, consumption) {
          var time = moment(consumption.date).startOf("day").unix()*1000;
          defaultConsumptions[time] += euros.value * (-consumption.delta);

          return appConsumptionsByDate;
        }, defaultConsumptions)
        .map(function(consumption, datetime) {
          return [parseInt(datetime), consumption];
        })
        .value()
      };
    };

    return _.chain(consumptions)
      .groupBy("appId")
      .map(consumptionsByDate)
      .value();
  };

  return Statistics;
}
