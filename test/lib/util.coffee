qs = require 'querystring'
_ = require 'lodash'

random = ->
  (Math.floor Math.random() * 1e8).toString(32)

exports.register = (username, callback) ->
    user = { username, password: '0000' }
    client.post '/register', user, (err, req, res, obj) ->
      callback err, obj

exports.getToken = (done) ->
  exports.register "test#{random()}", (err, res) =>
    @token = res.token
    done()

