module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true,
          cwd: __dirname,
          ignore: ['node_modules/**'],
          ext: 'js,coffee',
          watch: ['server'],
          delayTime: 3,
          legacyWatch: true
        }
      }
    },
    mochacli: {
      all: ['test/{,*/}*.js']
    },
    nodemon: {
      dev: {
        script: './src/server.js'
      }
    },
    watch: {
      scripts: {
        files: ['<%= jshint.all %>'],
        tasks: ['default']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/*.js',
        'test/*.js'
      ]
    },
    mochacov: {
      coveralls: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          output: './coverage.html'
        }
      },
      options: {
        files: 'test/*.js',
        require: ['should']
      }
    }
  });

  // Default task.
  grunt.registerTask('test', ['jshint', 'mochacli']);
  grunt.registerTask('travis', ['test', 'mochacov:coveralls']);
  grunt.registerTask('coverage', ['test', 'mochacov:coverage']);
  grunt.registerTask('default', ['concurrent']);
};