var restify  = require('restify')
    , mongoose = require('mongoose')
    , moment = require('moment');

moment().format();

// Logs
// ----------------------------------------------------------------------------
var bunyan = require('bunyan');
global.log = bunyan.createLogger({
  name: 'server-api',
  streams: [
    {
      level: 'info',
      path: 'logs/api-info.log'  // log ERROR and above to a file
//        stream: process.stdout,           // log INFO and above to stdout
    },
    {
      level: 'error',
      path: 'logs/api-error.log'  // log ERROR and above to a file
    },
    {
      level: 'debug',
      path: 'logs/debug.log'  // log ERROR and above to a file
    }
  ]
});

// Database
// ----------------------------------------------------------------------------

mongoose.connect('mongodb://localhost/pz-api');

require('./models/event');
require('./models/user');
require('./models/user-check-in')

// HTTP Server
// ----------------------------------------------------------------------------

var server = restify.createServer({
    /* https cert/key */
});

server.use([
    restify.queryParser({ mapParams: false })
  , restify.bodyParser()
]);

server.on('after', restify.auditLogger({ log: log }));

// Routes
// ----------------------------------------------------------------------------
var events = require('./controllers/events')
    , users = require('./controllers/users');

server.post('/register', users.register);
server.post('/login', users.login);

//// Require auth for every following method
server.use(users.authenticate);
server.post('/check-in', users.checkIn);

server.post('/api/friend', users.addFriend);
server.get('/api/friends', users.friends);
server.get('/api/friends/common/:friend', users.common);

server.get('/api/events', events.query );
server.post('/api/events', events.insert );
server.get('/api/events/:event', events.findOne );
server.patch('/api/events/:event', events.update );
server.del('/api/events/:event', events.remove );

server.post('/api/events/:event/beacons', events.updateUserBeacons );
server.get('/api/events/:event/beacons', events.getUserBeacons );

// Start up
// ----------------------------------------------------------------------------

module.exports = server;

if (!module.parent) {
    server.listen(8080, function(){
        console.log('%s listening at %s', server.name, server.url);
    })
}
