function initializeInvoice(client, settings) {
  var Invoice = {};

  Invoice.createInvoice = function(pack, orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings.post.apply(client, params)(JSON.stringify(pack)).mapError(JSON.parse).map(JSON.parse);
  };

  Invoice.getPaymentMethods = function() {
    return client.payments.methods.get()().mapError(JSON.parse).map(JSON.parse);
  };

  Invoice.choosePaymentMethod = function(method, invoice, orgaId) {
    var params = orgaId ? [orgaId, invoice.id] : [invoice.id];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings._.put.apply(client, params)(JSON.stringify(method)).mapError(JSON.parse).map(JSON.parse);
  };

  Invoice.getPaymillKey = function() {
    return client.payments.publickeys.paymill.get()().mapError(JSON.parse).map(JSON.parse);
  };

  Invoice.get = function(invoiceId, orgaId) {
    var params = orgaId ? [orgaId, invoiceId] : [invoiceId];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings._.get.apply(client, params)().mapError(JSON.parse).map(JSON.parse);
  };

  Invoice.getAll = function(orgaId) {
    var params = orgaId ? [orgaId] : [];
    var owner = orgaId ? client.organisations._ : client.self;

    return owner.payments.billings.get.apply(client, params)().mapError(JSON.parse).map(JSON.parse);
  };

  return Invoice;
}
