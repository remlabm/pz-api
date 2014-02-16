assert = require 'assert'
async = require 'async'
qs = require 'querystring'
util = require './lib/util'

describe 'Friends', ->
  before (done) ->
    async.parallel [
      (next) =>
        util.register 'john', (err, @john) =>
          next(err)
      (next) =>
        util.register 'mary', (err, @mary) =>
          next(err)
      (next) =>
        util.register 'tina', (err, @tina) =>
          next(err)
      (next) =>
        util.register 'fafa', (err, @fafa) =>
          next(err)
    ], done

  it 'should connect friends', (done) ->
    tokens =
      john: qs.stringify { token: @john.token }
      mary: qs.stringify { token: @mary.token }
    async.parallel [
      (next) => # John is friends with Mary
        client.post "/api/friend?#{tokens.john}", { friend: @mary._id }, (err, req, res, obj) ->
          assert.ifError err
          console.log('%d -> %j', res.statusCode, res.headers);
          assert obj
          next()

      (next) => # John is friends with Tina
        client.post "/api/friend?#{tokens.john}", { friend: @tina._id }, (err, req, res, obj) ->
          assert.ifError err
          console.log('%d -> %j', res.statusCode, res.headers);
          assert obj
          next()

      (next) => # Mary is friends with Tina
        client.post "/api/friend?#{tokens.mary}", { friend: @tina._id }, (err, req, res, obj) ->
          assert.ifError err
          console.log('%d -> %j', res.statusCode, res.headers);
          assert obj
          next()

      (next) => # Mary is friends with Fafa
        client.post "/api/friend?#{tokens.mary}", { friend: @fafa._id }, (err, req, res, obj) ->
          assert.ifError err
          console.log('%d -> %j', res.statusCode, res.headers);
          assert obj
          next()
    ], done


  it 'should know john and mary are happy friends', (done) ->
    q1 = qs.stringify { token: @john.token }
    q2 = qs.stringify { token: @mary.token }
    async.parallel
      john: (next) ->
        client.get "/api/friends?#{q1}", (err, req, res, obj) ->
          console.log('%d -> %j', res.statusCode, res.headers);
          next err, obj
      mary: (next) ->
        client.get "/api/friends?#{q2}", (err, req, res, obj) ->
          console.log('%d -> %j', res.statusCode, res.headers);
          next err, obj
    , (err, friendsOf) =>
      assert.ifError err
      assert @mary._id in friendsOf.john
      assert @john._id in friendsOf.mary
      done()

  it 'should get mary\'s friends', (done) ->
    q = qs.stringify { token: @mary.token }
    # Mutual friends between Mary and John
    client.get "/api/friends?#{q}", (err, req, res, friends) =>
      assert.ifError err
      console.log('%d -> %j', res.statusCode, res.headers);
      assert.equal friends.length, 3
      assert @john._id in friends
      assert @tina._id in friends
      assert @fafa._id in friends
      done()

  it 'should get mary and john\'s mutual friends', (done) ->
    q = qs.stringify { token: @mary.token }
    # Mutual friends between Mary and John
    client.get "/api/friends/common/#{@john._id}?#{q}", (err, req, res, common) =>
      assert.ifError err
      console.log('%d -> %j', res.statusCode, res.headers);
      assert.equal common.length, 1
      assert @tina._id in common
      done()
        
    
