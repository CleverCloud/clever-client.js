module.exports = function(grunt) {
  var http = require("http");
  var fs = require("fs");
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
        src: ["src/data/methods.js", "src/models/**/*.js", "src/client.js"],
        dest: "clever-client.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-bower-concat");

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

  grunt.registerTask("default", ["bower_concat", "wadl2json", "concat"]);
};
