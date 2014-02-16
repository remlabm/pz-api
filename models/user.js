var mongoose = require('mongoose')
  , restify  = require('restify')
  , pwd      = require('pwd')
  , tokens   = require('../lib/tokens')

var UserSchema = new mongoose.Schema({
    username : { type: String }
  , password : { type: String }
  , salt     : { type: String }
  , friends  : [mongoose.Schema.ObjectId]
})

UserSchema.static('register', function (username, password, callback) {
    var User = this
    pwd.hash(password, function (err, salt, hash) {
        if (err) return callback(err)

        var data = {
            username : username
          , password : hash.toString('base64')
          , salt     : salt
        }
        
        User.create(data, function (err, user) {
            if (err) return callback(err)
            tokens.generate(user._id, function (err, token) {
                if (err) return callback(err)
                callback(null, {
                    _id      : user._id
                  , username : username
                  , token    : token
                })
            })
        })
    })
})

UserSchema.static('getToken', function (username, password, callback) {
    this.findOne({ username: username }, function (err, user) {
        if (err) return callback(err)

        pwd.hash(password, user.salt, function (err, hash) {
            if (err) return callback(err)

            hash = hash.toString('base64')
            if (user.password === hash) {
                tokens.generate(user._id, function (err, token) {
                    callback(null, {
                        _id      : user._id
                      , username : username
                      , token    : token
                    })
                })
            } else {
                callback(new restify.NotAuthorizedError)
            }
        })
    })
})

module.exports = mongoose.model('User', UserSchema)
