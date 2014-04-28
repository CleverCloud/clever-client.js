function initializeProducts(client, settings) {
  var Products = {};

  Products.getInstances = function(orgaId) {
    return client.products.instances.get()({
      query: orgaId ? {"for": orgaId} : {}
    }).mapError(JSON.parse).map(JSON.parse);
  };

  Products.getPackages = function(couponName, orgaId) {
    var query = _.extend({}, couponName && {coupon: couponName}, orgaId && {orgaId: orgaId});

    return client.products.packages.get()({query: query}).mapError(JSON.parse).map(JSON.parse);
  };

  Products.getPrices = function() {
    return client.products.prices.get()().mapError(JSON.parse).map(JSON.parse);
  };

  Products.getCoupon = function(coupon) {
    return client.payments.coupons._.get(coupon)().mapError(JSON.parse).map(JSON.parse);
  };

  return Products;
}
