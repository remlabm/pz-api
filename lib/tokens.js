var mongoose = require('mongoose')
  , crypto   = require('crypto')
  , restify  = require('restify')

function generateToken () {
    return crypto.randomBytes(16).toString('hex')
}

var TokenSchema = new mongoose.Schema({
    token  : { type: String, default: generateToken } 
  , userid : { type: mongoose.Schema.ObjectId }
  , expire : { type: Date, default: Date.now, index: { expires: 3600 }}
})

TokenSchema.static('generate', function (userid, callback) {
    this.create({ userid: userid }, function (err, token) {
        if (err) return callback(err)
        callback(null, token.token)
    })
})

TokenSchema.static('verify', function (_token, callback) {
    this.findOne({ token: _token }, function (err, token) {
      if (err) return callback(err)
      if (!token) return callback(new restify.InvalidCredentialsError)
      callback(null, token.userid)
    })
})

module.exports = mongoose.model('AccessToken', TokenSchema)
