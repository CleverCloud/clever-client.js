function initializeNews(client, settings) {
  var News = {};

  News.getBlogPosts = function() {
    return client.newsfeeds.blog.get()().chain(function(xml) {
      var result = new Promise();
      var $feed = xml.getElementsByTagName("feed")[0];

      if(!$feed) {
        result.reject(xml);
      }
      else {
        var $entries = $feed.getElementsByTagName("entry");

        var entry2post = function(entry) {
          return {
            title: entry.getElementsByTagName("title")[0].childNodes[0].data,
            href: entry.getElementsByTagName("link")[0].getAttribute("href"),
            updated: new Date(entry.getElementsByTagName("updated")[0].childNodes[0].data)
          };
        };

        result.resolve(_.map($entries, entry2post));
      }

      return result;
    });
  };

  News.getEngineeringPosts = function() {
    return client.newsfeeds.engineering.get()().chain(function(xml) {
      var result = new Promise();
      var $feed = xml.getElementsByTagName("feed")[0];

      if(!$feed) {
        result.reject(xml);
      }
      else {
        var $entries = $feed.getElementsByTagName("entry");

        var entry2post = function(entry) {
          return {
            title: entry.getElementsByTagName("title")[0].childNodes[0].data,
            href: entry.getElementsByTagName("link")[0].getAttribute("href"),
            updated: new Date(entry.getElementsByTagName("updated")[0].childNodes[0].data)
          };
        };

        result.resolve(_.map($entries, entry2post));
      }

      return result;
    });
  };

  return News;
}
