var _ = require('lodash'),
    mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  title : { type : String, required : true },
  date : { type : Date, required : true },
  cordLong : { type: Number, required : true },
  cordLat : { type: Number, required : true }
});

//EventSchema.path('tags').set(function(val) {
//    if (val === undefined) {
//      return val;
//    }
//
//    if (_.isArray(val)) {
//      return val;
//    }
//
//    return val.split(',');
//  });

var models = {
  Events : mongoose.model('events', EventSchema)
}

module.exports = models;