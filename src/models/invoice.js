function initializeInvoice(client, settings) {
  var Invoice = {};

  Invoice.createInvoice = function(pack, orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings.post.apply(client, params)(JSON.stringify(pack));
  };

  Invoice.getPaymentProviders = function() {
    return client.payments.providers.get()();
  };

  Invoice.choosePaymentProvider = function(method, invoice, orgaId) {
    var params = orgaId ? [orgaId, invoice.id] : [invoice.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings._.put.apply(client, params)(JSON.stringify(method));
  };

  Invoice.getBraintreeToken = function() {
    return client.payments.tokens.bt.get()();
  };

  Invoice.get = function(invoiceId, orgaId) {
    var params = orgaId ? [orgaId, invoiceId] : [invoiceId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings._.get.apply(client, params)();
  };

  Invoice.getAll = function(orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings.get.apply(client, params)();
  };

  return Invoice;
}
