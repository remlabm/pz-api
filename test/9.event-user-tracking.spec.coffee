assert = require 'assert'
_ = require 'lodash'
async  = require 'async'
qs     = require 'querystring'
util   = require './lib/util'
moment = require 'moment'

random = ->
  (Math.floor Math.random() * 1e8).toString(32)

describe 'Event User Tracking', ->

  before (done) ->
    async.parallel [
      (next) => util.register 'john', (err, @john) => next(err)
      (next) => util.register 'jill', (err, @jill) => next(err)
      (next) => util.register 'diane', (err, @diane) => next(err)
    ], done

  eventId = null;

  describe 'Create the Event', ->

    it 'should create a new event and return the event', ( done ) ->
      eventData = {
        name: "Test Event"
        date: moment('April 25, 2014')
        location :
          name: 'Palms Casino'
          address : 'Las Vagas, Nevada'
        invited: [ @john._id, @jill._id, @diane._id ]
      }

      tokens =
        john : qs.stringify { token: @john.token }

      client.post "/api/events?#{tokens.john}", eventData, ( err, req, res, event ) =>
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.equal res.statusCode, 301
        assert res.headers.location
        client.get "#{res.headers.location}?#{tokens.john}", ( err, req, res, event ) =>
          console.info('%d -> %j', res.statusCode, res.headers);
          assert.ifError err
          assert event._id
          assert.equal event._user, @john._id
          assert.deepEqual event.invited, eventData.invited
          eventId = event._id
          done()

  describe 'Get User Beacons', ->

    checkInData = {
      location: {
        dds: "33.979444, -118.452778"
      }
    }

    johnsDistance = 787621

    it 'should allow a user to update their locaiton', (done) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.post "/check-in?#{tokens.john}", checkInData, (err, req, res, obj) ->
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.ifError err
        assert.equal obj.status, 'ok'
        done()

    it 'should update event user beacons', (done) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.post "/api/events/#{eventId}/beacons?#{tokens.john}", ( err, req, res, beacons ) =>
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.ifError err
        johnsBeacon = _.find( beacons, { '_user' : @john._id });
        assert.equal johnsBeacon.distance, johnsDistance
        done()

    it 'should return an array of user beacons', ( done ) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.get "/api/events/#{eventId}/beacons?#{tokens.john}", ( err, req, res, beacons ) =>
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.ifError err
        johnsBeacon = _.find( beacons, { '_user' : @john._id });
        assert.isNotNull johnsBeacon.arriveAt
        done()

