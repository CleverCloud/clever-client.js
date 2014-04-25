var _ = require("lodash");
var http = require("http");
var static = require("node-static");

var file = new static.Server('.');
var urlPrefix = "/v2";
var server;

exports.proxy = function(request, response) {
  var requestData = "";

  request.on("data", function(chunk) {
    requestData += chunk;
  });

  request.on("end", function() {
    var options = {
      host: "api.par0.clvrcld.net",
      path: request.url,
      method: request.method,
      headers: _.extend({},
        request.headers.authorization ? {"Authorization": request.headers.authorization} : {},
        request.headers["content-type"] ? {"Content-Type": request.headers["content-type"]} : {}
      )
    };

    var req = http.request(options, function(res) {
      var resData = "";

      res.on("data", function(chunk) {
        resData += chunk;
      });

      res.on("end", function() {
        response.statusCode = res.statusCode;

        for(var name in res.headers) {
          response.setHeader(name, res.headers[name]);
        }

        response.end(resData);
      });
    });

    req.end(requestData);
  });
};

exports.start = function() {
  console.log("Start test server on 8080…");

  server = require("http").createServer(function(req, res) {
    if(req.url.indexOf(urlPrefix) == 0) {
      exports.proxy(req, res);
    }
    else {
      req.addListener("end", function () {
        file.serve(req, res);
      }).resume();
    }
  }).listen(8080);
};

exports.stop = function() {
  server && server.close();
};

if(process.argv[2] == "start") {
  exports.start();
}
