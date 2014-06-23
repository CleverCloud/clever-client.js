module.exports = function(grunt) {
  var http = require("http");
  var fs = require("fs");
  var server = require("./tests/server.js");
  var wadl2json = require("wadl2json");

  grunt.initConfig({
    bower_concat: {
      all: {
        dest: "tests/dependencies.js"
      }
    },
    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: ["src/methods.js", "src/require.js", "src/models/**/*.js", "src/client.js"],
        dest: "dist/clever-client.js"
      }
    },
    jasmine: {
      src: ["tests/*-dump.js", "tests/dependencies.js", "dist/clever-client.js"],
      options: {
        host: "http://127.0.0.1:8080/",
        keepRunner: true,
        outfile: "index.html",
        specs: "tests/**/*.spec.js"
      }
    },
    jasmine_node: {
      all: "tests"
    },
    uglify: {
      all: {
        files: {
          "dist/clever-client.min.js": "dist/clever-client.js"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-bower-concat");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-jasmine-node");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("start-server", "Start test server", function() {
    server.start();
  });

  grunt.registerTask("stop-server", "Stop test server", function() {
    server.stop();
  });

  grunt.registerTask("wadl2json", "Fetch Clever-Cloud API description", function() {
    var done = this.async();
    var filename = "src/methods.js";

    var options = {
      sort: true,
      stringify: true,
      prettify: true
    };

    wadl2json.fromURL("https://api.clever-cloud.com/v2/application.wadl", function(err, methods) {
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

  grunt.registerTask("build", ["bower_concat", "wadl2json", "concat", "uglify"]);
  grunt.registerTask("test", ["build", "start-server", "jasmine", "jasmine_node", "stop-server"]);
  grunt.registerTask("default", ["build"]);
};
