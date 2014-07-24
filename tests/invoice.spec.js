describe("Invoice.getAll", function() {
  it("should be able to get all invoices", function(done) {
    var result = api.invoice.getAll();

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Invoice.get", function() {
  it("should be able to get an invoice", function(done) {
    var result = api.invoice.get("creditnote_24b87a84-361c-4657-93b0-ca97048e82a71398851774650");

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});

describe("Invoice - buy credits", function() {
  it("should be able to buy credits with credit card", function(done) {
    var paymentPackage = {"currency":"EUR","packageId":1};
    var paymentMethod = {"method":"CREDITCARD","imgUrl":"","title":"Credit card","comingSoon":false};

    var p_invoice = api.invoice.createInvoice(paymentPackage);
    var p_invoiceWithMethod = p_invoice.chain(function(invoice) {
      return api.invoice.choosePaymentMethod(paymentMethod, invoice);
    });

    var p_paymillKey = api.invoice.getPaymillKey();

    console.log("TODO: add paymill client to clever-client.js in order to fully test the payment flow");
    var result = p_invoiceWithMethod.chain(function(invoice) {
      return p_paymillKey;
    });

    var oncomplete = function() {
      expect(result.resolved).toBe(true);
      done();
    };

    result.then(oncomplete, function(error) {
      console.log(JSON.stringify(error));
      oncomplete();
    });
  });
});
