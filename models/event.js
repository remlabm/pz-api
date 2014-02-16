var mongoose = require('mongoose')
    , request = require('request')
    , rel = require('mongo-relation');

var EventSchema = new mongoose.Schema({
  _user : mongoose.Schema.Types.ObjectId,
  name : { type : String, required : true },
  type : { type: String, required: true, default: 'private' },
  location: {
    dds : { type: String, required: true }
  },
  date : { type: Date },
  createdOn : { type: Date, default: Date.now }
});

EventSchema.hasMany('Users', {through: 'attending'});

module.exports = mongoose.model('Event', EventSchema);
