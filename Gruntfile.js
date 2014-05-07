module.exports = function(grunt) {
  var http = require("http");
  var fs = require("fs");
  var server = require("./tests/server.js");
  var wadl2json = require("wadl2json");

  grunt.initConfig({
    bower_concat: {
      all: {
        dest: "src/dependencies.js"
      }
    },
    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: ["src/data/methods.js", "src/require.js", "src/models/**/*.js", "src/client.js"],
        dest: "clever-client.js"
      }
    },
    jasmine: {
      src: ["tests/*-dump.js", "src/dependencies.js", "clever-client.js"],
      options: {
        host: "http://127.0.0.1:8080/",
        //keepRunner: true, // Uncomment this line for manual tests
        outfile: "index.html",
        specs: "tests/**/*.spec.js"
      }
    },
    jasmine_node: {
      all: "tests"
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-bower-concat");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-jasmine-node");

  grunt.registerTask("start-server", "Start test server", function() {
    server.start();
  });

  grunt.registerTask("stop-server", "Stop test server", function() {
    server.stop();
  });

  grunt.registerTask("wadl2json", "Fetch Clever-Cloud API description", function() {
    var done = this.async();
    var filename = "src/data/methods.js";

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

  grunt.registerTask("build", ["bower_concat", "wadl2json", "concat"]);
  grunt.registerTask("test", ["start-server", "jasmine", "jasmine_node", "stop-server"]);
  grunt.registerTask("default", ["build", "test"]);
};
