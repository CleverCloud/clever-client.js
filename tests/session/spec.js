var env = require("system").env;

var email = env.CLEVER_CLOUD_EMAIL;
var password = env.CLEVER_CLOUD_PASSWORD;

casper.test.begin("OAuth dance does work", 1, function(test) {
  casper
    .start("http://localhost:8080/tests/session")
    .waitForUrl(/session\/login/, function() {
      this.echo("Login with " + email);
    })
    .thenEvaluate(function(email, password) {
      document.querySelector("#login-email").setAttribute("value", email);
      document.querySelector("#login-pwd").setAttribute("value", password);
      document.querySelector("form.login-form").submit();
    }, email, password)
    .waitForSelectorTextChange("#success", function() {
      test.assertSelectorHasText("#success", "OAuth dance does work!");
    })
    .run(function() {
      test.done();
    });
});
