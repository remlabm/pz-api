var restify = require('restify'),
    mongoose = require('mongoose'),
    restifyMongoose = require('restify-mongoose'),
    _ = require('lodash');

mongoose.connect('mongodb://localhost/projectY');

var models = require('./models');

var server = restify.createServer({
  name: '0.0.0.0',
  version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Public route to serve angular.js app and html/js/css files
server.get(/\/public\/?.*/, restify.serveStatic({ directory : './src/public' }));

_( models).forEach( function( model, modelName ){
  // Serve model Note as a REST API
  restifyMongoose( model ).serve('/' + modelName.toLowerCase(), server);
});

server.listen(3000, function () {
  console.log('Server Started: %s on %s', server.name, server.url);
});