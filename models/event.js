var mongoose = require('mongoose')
  , User = mongoose.model('User');

var EventSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  type: { type: String, required: true, default: 'private' },
  location: {
    name: { type: String, required: true },
    address: { type: String, required: true }
  },
  date: { type: Date },
  createdOn: { type: Date, default: Date.now },
  beacons: [ { type: mongoose.Schema.Types.ObjectId, ref: 'EventBeacon'} ],
  invited: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', EventSchema);
