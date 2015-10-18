/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      js1: {
        src: ['scripts/main.js', 'scripts/computeDimension.js', 'scripts/run.js'],
        dest: 'src/main.js'
      }
    },
    connect: {
      options: {
        livereload: true,
        port: 3000
      },
      livereload: {
        options: {
          middleware: function(connect) {
            var serveStatic = require('./node_modules/grunt-contrib-connect/node_modules/serve-static');
            var app = connect();
            app.use('/bower_components', serveStatic('./bower_components'));
            app.use(serveStatic('src'));
            return [
              app
            ];
          }
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          'Konva': true
        }
      },
      js: {
        files: ['scripts/*.js']
      }
    },
    watch: {
      www: {
        files: ['src/*.{html,css,js}'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      js: {
        files: ['scripts/*.js'],
        tasks: ['concat']
      }
    },
    wiredep: {
      bower: {
        src:'src/index.html'
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt)
  // Default task.
  grunt.registerTask('default', ['connect', 'concat', 'watch']);

};
