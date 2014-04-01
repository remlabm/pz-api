var mongoose = require('mongoose')
  , _ = require('lodash')
  , moment = require('moment');

function getValue( val ){
  return _.pluck( val, 'value');
}

var EventBeaconSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  _event: { type: mongoose.Schema.ObjectId, ref: 'Event' },
  duration: { type: mongoose.Schema.Types.Mixed, set: getValue },
  distance: { type: mongoose.Schema.Types.Mixed, set: getValue },
  checkInAt: { type: Date, default: Date.now },
  createdOn: { type: Date, default: Date.now }

});

if (!EventBeaconSchema.options.toObject) EventBeaconSchema.options.toObject = {};
EventBeaconSchema.options.toObject.transform = function (doc, ret, options) {
  if( ret.duration ){
    ret.arriveAt = moment( ret.checkInAt ).add('seconds', ret.duration ).format()
  }
  ret.test = 'blah'
};


module.exports = mongoose.model('EventBeacon', EventBeaconSchema );