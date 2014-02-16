var mongoose = require('mongoose')
    , request = require('request')
    , _ = require('lodash')
    , rel = require('mongo-relation');

var UserCheckInSchema = new mongoose.Schema({
  _user : mongoose.Schema.Types.ObjectId,
  location: {
    dds : { type: String, required: true }
  },
  createdOn : { type: Date, default: Date.now }
});

UserCheckInSchema.static('getLatest', function( userId, callback ){
  this.findOne( { _user : userId }, function( err, checkIn ){
    if( err ) return callback( err );
    if( _.isEmpty( checkIn )){
      return callback( null, { userId : userId, lastLocation: null, lastSeen: null } );
    }
    return callback( null, { userId : userId, lastLocation: checkIn.location.dds, lastSeen: checkIn.createdOn } );
  })
});


module.exports = mongoose.model('UserCheckIn', UserCheckInSchema);
