restify = require 'restify'
restify = require 'restify'
bunyan = require 'bunyan'

global.server = require './../'

# mock route
server.get '/echo', (req, res) ->
  res.send req.query

global.log = bunyan.createLogger {
    name: 'all-tests'
    streams: [
      {
        level: 'info'
        path: 'logs/api-client-info.log'
      }
      {
        level: 'error'
        path: 'logs/api-client-error.log'
      }
      {
        level: 'debug'
        path: 'logs/debug.log'
      }
    ]
  }

global.client = restify.createJsonClient {
  url: 'http://localhost:8080'
  log: log
}

before (done) ->
  server.listen 8080, '127.0.0.1', done

