var mongoose = require('mongoose')
    , request = require('request')
    , rel = require('mongo-relation');

var UserCheckInSchema = new mongoose.Schema({
  _user : mongoose.Schema.Types.ObjectId,
  location: {
    dds : { type: String, required: true }
  },
  createdOn : { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserCheckIn', UserCheckInSchema);
