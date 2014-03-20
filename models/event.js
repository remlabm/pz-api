var mongoose = require('mongoose')
  , request = require('request')
  , rel = require('mongo-relation');

var EventSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  type: { type: String, required: true, default: 'private' },
  location: {
    name: { type: String, required: true },
    address: { type: String, required: true }
  },
  date: { type: Date },
  createdOn: { type: Date, default: Date.now },
  beacons: { type: mongoose.Schema.Types.Mixed },
  invited: [ mongoose.Schema.Types.ObjectId ]
});

EventSchema.hasMany('Users', {through: 'invited'});

module.exports = mongoose.model('Event', EventSchema);
