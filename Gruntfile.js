module.exports = function(grunt) {
  var http = require("http");
  var fs = require("fs");
  var wadl2json = require("wadl2json");

  grunt.initConfig({
    browserify: {
      test: {
        files: {
          "tests/bundle.js": "tests/all.spec.js"
        },
        options: {
          exclude: ["request", "xml2json"]
        }
      }
    },
    casper: {
      test: {
        options: {
          test: true
        },
        files: {
          "xunit/session.xml": ["tests/session/spec.js"]
        }
      }
    },
    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: ["src/methods.js", "src/owner.js", "src/session.js", "src/self.js", "src/clever-client.js"],
        dest: "dist/clever-client.js"
      }
    },
    express: {
      test: {
        options: {
          script: "tests/server/app.js"
        }
      },
      manual: {
        options: {
          background: false,
          script: "tests/server/app.js"
        }
      }
    },
    jasmine: {
      test: {
        options: {
          host: "http://127.0.0.1:1234/",
          specs: "tests/bundle.js"
        }
      }
    },
    jasmine_node: {
      test: ["tests/"]
    },
    uglify: {
      all: {
        files: {
          "dist/clever-client.min.js": "dist/clever-client.js"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-casper");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-express-server");
  grunt.loadNpmTasks("grunt-jasmine-node");

  grunt.registerTask("wadl2json", "Fetch Clever-Cloud API description", function() {
    var done = this.async();
    var filename = "src/methods.js";

    var options = {
      sort: true,
      stringify: true,
      prettify: true
    };

	 var url = (process.env['API_BASE_URL'] || "https://api.clever-cloud.com/v2") + "/application.wadl";
	 console.log("Using url", url);
    wadl2json.fromURL(url, function(err, methods) {
      if(err) {
        grunt.log.error(err);
        done(false);
      }
      else {
        var content = "var methods = " + methods + ";";
        fs.writeFile(filename, content, function(err) {
          if(err) {
            grunt.log.error(err);
            done(false);
          }
          else {
            grunt.log.writeln("File " + filename + " created.");
            done();
          }
        });
      }
    }, options);
  });

  grunt.registerTask("build", ["wadl2json", "concat", "uglify"]);
  grunt.registerTask("test", ["build", "browserify", "express:test", "casper", "jasmine", "jasmine_node"]);
  grunt.registerTask("default", ["build"]);
};
