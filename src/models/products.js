function initializeProducts(client, settings) {
  var Products = {};

  Products.getInstances = function(orgaId) {
    return client.products.instances.get()({
      query: orgaId ? {"for": orgaId} : {}
    });
  };

  Products.getPackages = function(couponName, orgaId) {
    var query = _.extend({}, couponName && {coupon: couponName}, orgaId && {orgaId: orgaId});

    return client.products.packages.get()({query: query});
  };

  Products.getPrices = function() {
    return client.products.prices.get()();
  };

  Products.getCoupon = function(coupon) {
    return client.payments.coupons._.get(coupon)();
  };

  return Products;
}
