var mongoose = require('mongoose')
    , restify = require('restify')
    , async = require('async')
    , tokens = require('../lib/tokens')
    , dispatch = require('../lib/dispatch')
    , User = mongoose.model('User')
    , UserCheckIn = mongoose.model('UserCheckIn');

// ### Register
exports.register = function (req, res, next) {
  User.register(req.params.username, req.params.password, dispatch(res, next))
};

// ### Login
exports.login = function (req, res, next) {
  User.getToken(req.params.username, req.params.password, dispatch(res, next))
};

// ### Auth
exports.authenticate = function (req, res, next) {
  tokens.verify(req.query.token, function (err, userId) {
    if (err || !userId) {
      res.send(new restify.NotAuthorizedError);
      return
    }
    req._user = userId;
    if (req.method === 'PATCH' || req.method === 'POST') {
      req.body._user = userId;
    }
    next()
  })
};

// ### Checkin
exports.checkIn = function (req, res, next) {
  UserCheckIn.create( req.body, function (err, checkIn) {
    if( err ) return next( err );
    res.send( { status: 'ok' } );
    return next()
  })
};

// ### Add friend
exports.addFriend = function (req, res, next) {
  User.findById(req.body.friend, function (err, friend) {
    async.parallel([
      function (callback) {
        friend.update({ $addToSet: { friends: req._user } }, callback)
      },
      function (callback) {
        User.update({ _id: req._user }, { $addToSet: { friends: friend._id } }, callback)
      }
    ], function (err) {
      if (err) return next(err);
      res.send({ success: true });
      return next()
    })
  })
};

// ### List friends
exports.friends = function (req, res, next) {
  User.findById(req._user, function (err, user) {
    if (err) return next(err);
    res.send(user.friends);
    return next()
  })
};

// ### List common friends
exports.common = function (req, res, next) {
  var friend = req.params.friend;

  async.parallel([
    function (callback) {
      User.findById(req._user, callback)
    }
    , function (callback) {
      User.findById(friend, callback)
    }
  ], function (err, results) {
    if (err || results.length < 2) return next(err);

    var others = results[1].friends;
    res.send(results[0].friends.reduce(function (common, id) {
      if (others.indexOf(id) >= 0) common.push(id);
      return common
    }, []));
    return next()
  })
};

