function initializeNews(client, settings) {
  var News = {};
  var P = typeof require == "function" && require("pacta") ? require("pacta") : Promise;

  var browser_xml2entries = function(xml) {
    var result = new P();
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
  };

  var node_xml2entries = function(xml) {
    var $feed = xml && xml.feed && xml.feed[0];
    var entries = _.map($feed.entry, function($entry) {
      return {
        title: $entry.title && $entry.title[0] && $entry.title[0].$t,
        link: $entry.link && $entry.link[0] && $entry.link[0].href,
        updated: $entry.updated && $entry.updated[0] && new Date($entry.updated[0])
      };
    });

    return P.of(entries);
  };

  var xml2entries = (typeof XMLDocument == "undefined") ? node_xml2entries : browser_xml2entries;

  News.getBlogPosts = function() {
    return client.newsfeeds.blog.get()().chain(xml2entries);
  };

  News.getEngineeringPosts = function() {
    return client.newsfeeds.engineering.get()().chain(xml2entries);
  };

  return News;
}
