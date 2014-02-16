var mongoose = require('mongoose')
    , restify  = require('restify')
    , async    = require('async')
    , Event     = mongoose.model('Event')
    , User = mongoose.model('User')
    , UserCheckIn = mongoose.model('UserCheckIn');

// ### List Events
exports.query = function (req, res, next) {
  var _query = Event.find({});

  _query.exec( function (err, events) {
    if( err ) return next( err );

    res.send( events );
    return next()
  })
};

// ### Get Event Details
exports.findOne = function (req, res, next) {
  Event.findById( req.params.event, function (err, event) {
    if( err ) return next( err );
    res.send(event);
    return next()
  })
};

// ### Add Event
exports.insert = function (req, res, next) {
  Event.create( req.body, function (err, event) {
    if( err ) return next( err );
    res.header("Location", "/api/events/" + event._id );
    res.send(301);
    return next()
  })
};

// ### Update Event
exports.update = function (req, res, next) {
  Event.findOneAndUpdate( req.params.event, req.body, function (err, event) {
    if( err ) return next( err );
    res.send( event );
    return next()
  })
};

// ### Remove Event
exports.remove = function( req, res, next ){
  Event.remove( { _id : req.params.event }, function( err ){
    if( err ) return next( err );
    res.send( 204 );
    return next()
  })
};

// ### Get Check In List
exports.getCheckInList = function( req, res, next ){
  console.log('controller')
  Event.findById( req.params.event, function (err, event) {
    if( err ) return next( err );
    async.map( event.attending, UserCheckIn.getLatest.bind( UserCheckIn ), function( err, checkInList ){
      if( err ) return next( err );
      console.dir( checkInList )
      res.send( checkInList );
      return next()
    });
  })
}