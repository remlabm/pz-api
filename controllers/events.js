var mongoose = require('mongoose')
    , restify  = require('restify')
    , qs = require('querystring')
    , _ = require('lodash')
    , async    = require('async')
    , moment = require('moment')
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
exports.getUserBeacons = function( req, res, next ){
  console.log('controller')
  Event.findById( req.params.event, function (err, event) {
    if( err ) return next( err );
    res.send( event.beacons );
    next();
  })
};

// ### Get Check In List
exports.updateUserBeacons = function( req, res, next ){
  Event.findById( req.params.event, function (err, event) {
    if( err ) return next( err );

    UserCheckIn.find( { _user: { $in: event.attending } })
        .where('location.dds').exists( true )
        .exec( function( err, checkInList ){
          if( err ) return next( err );
          getMapData( _.pluck( checkInList, 'location'), event.location.address, function( err, mapData){
            if( err ) return next( err );

            //TODO: this is sketch
            var beacons = [];
            _( checkInList ).forEach( function( checkIn, idx ){
              beacons[idx] = _.merge( mapData[idx], {
                _user: checkIn._user,
                checkInDate: checkIn.createdOn,
                estimatedArrival: moment( checkIn.createdOn ).add('seconds', mapData[idx].duration.value).format()
              });
            });

            event.beacons = beacons;
            event.save(function( err, event ){
              if( err ) return next( err );

              res.send( event.beacons );
              next();
            });
        });
    })
  })
};

var getMapData = function( origins, destination, callback ){

  var client = restify.createJsonClient({
    url: 'http://maps.googleapis.com'
  });

  var q = qs.stringify({
    origins: _.pluck( origins, 'dds').toString("|"),
    destinations : destination,
    sensor: false
  });
  client.get({
    path: "/maps/api/distancematrix/json?"+ q
  }, function( err, req, res, obj ){
    if( err ) return callback( err );

    return callback( null, obj.rows[0].elements )
  });
};
