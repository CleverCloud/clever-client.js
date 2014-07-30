casper.test.begin("OAuth dance does work", 1, function(test) {
  casper
    .start("http://127.0.0.1:1234/tests/session")
    .waitForUrl(/oauth_token=/)
    .waitForSelectorTextChange("#success", function() {
      test.assertSelectorHasText("#success", "OAuth dance does work!");
    })
    .run(function() {
      test.done();
    });
});
