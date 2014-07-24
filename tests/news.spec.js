describe("News.getBlogPosts", function() {
  it("should be able to get posts from Clever-Cloud blog", function(done) {
    var result = api.news.getBlogPosts();

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

describe("News.getEngineeringPosts", function() {
  it("should be able to get posts from Clever-Cloud tech blog", function(done) {
    var result = api.news.getEngineeringPosts();

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
