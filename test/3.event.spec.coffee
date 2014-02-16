assert = require 'assert'
_ = require 'lodash'
async  = require 'async'
qs     = require 'querystring'
util   = require './lib/util'
moment = require 'moment'

random = ->
  (Math.floor Math.random() * 1e8).toString(32)

describe 'Events', ->

  before (done) ->
    async.parallel [
      (next) => util.register 'john', (err, @john) => next(err)
    ], done


  eventData = {
    name: "Test Event",
    date: moment('April 25, 2014'),
    location : {
      dds : '36.1749700,-115.1372200'
    }
  }

  describe 'Create', ->

    it 'should create a new event and return the event', ( done ) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.post "/api/events?#{tokens.john}", eventData, ( err, req, res, event ) =>
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.equal res.statusCode, 301
        assert res.headers.location

        client.get "#{res.headers.location}?#{tokens.john}", ( err, req, res, event ) =>
          console.log('%d -> %j', res.statusCode, res.headers);
          assert.ifError err
          assert event._id
          assert.equal event._user, @john._id
          eventData._id = event._id
          done()

  describe 'Query', ->
    it 'should return an array of events', ( done ) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.get "/api/events?#{tokens.john}",  ( err, req, res, events ) =>
        assert.ifError err
        console.log('%d -> %j', res.statusCode, res.headers);
        done()

    it 'should return our event', ( done ) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.get "/api/events/#{eventData._id}?#{tokens.john}", ( err, req, res, event ) =>
        assert.ifError err
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.equal event._id, eventData._id
        done()

  describe 'Update', ->
    eventPatchData = {
      name: "Birthday Event"
    }

    it 'should update event name to Birthday Event', ( done ) ->
      tokens =
        john : qs.stringify { token: @john.token }

      client.patch "/api/events/#{eventData._id}?#{tokens.john}",  eventPatchData, ( err, req, res, event ) =>
        assert.ifError err
        console.log('%d -> %j', res.statusCode, res.headers);
        assert.equal event.name, eventPatchData.name
        assert.equal event._user, @john._id
        done()

#  describe 'Delete', =>
#    it 'should delete event', ( done ) ->
#      tokens =
#        john : qs.stringify { token: @john.token }
#
#      client.del "/api/events/#{eventData._id}?#{tokens.john}", ( err, req, res ) =>
#        assert.ifError err
#        console.log('%d -> %j', res.statusCode, res.headers);
#        done()


