'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Speaker = mongoose.model('Speaker'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  speaker;

/**
 * Speaker routes tests
 */
describe('Speaker CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Speaker
    user.save(function () {
      speaker = {
        name: 'Speaker name'
      };

      done();
    });
  });

  it('should be able to save a Speaker if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Speaker
        agent.post('/api/speakers')
          .send(speaker)
          .expect(200)
          .end(function (speakerSaveErr, speakerSaveRes) {
            // Handle Speaker save error
            if (speakerSaveErr) {
              return done(speakerSaveErr);
            }

            // Get a list of Speakers
            agent.get('/api/speakers')
              .end(function (speakersGetErr, speakersGetRes) {
                // Handle Speakers save error
                if (speakersGetErr) {
                  return done(speakersGetErr);
                }

                // Get Speakers list
                var speakers = speakersGetRes.body;

                // Set assertions
                (speakers[0].user._id).should.equal(userId);
                (speakers[0].name).should.match('Speaker name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Speaker if not logged in', function (done) {
    agent.post('/api/speakers')
      .send(speaker)
      .expect(403)
      .end(function (speakerSaveErr, speakerSaveRes) {
        // Call the assertion callback
        done(speakerSaveErr);
      });
  });

  it('should not be able to save an Speaker if no name is provided', function (done) {
    // Invalidate name field
    speaker.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Speaker
        agent.post('/api/speakers')
          .send(speaker)
          .expect(400)
          .end(function (speakerSaveErr, speakerSaveRes) {
            // Set message assertion
            (speakerSaveRes.body.message).should.match('Please fill Speaker name');

            // Handle Speaker save error
            done(speakerSaveErr);
          });
      });
  });

  it('should be able to update an Speaker if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Speaker
        agent.post('/api/speakers')
          .send(speaker)
          .expect(200)
          .end(function (speakerSaveErr, speakerSaveRes) {
            // Handle Speaker save error
            if (speakerSaveErr) {
              return done(speakerSaveErr);
            }

            // Update Speaker name
            speaker.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Speaker
            agent.put('/api/speakers/' + speakerSaveRes.body._id)
              .send(speaker)
              .expect(200)
              .end(function (speakerUpdateErr, speakerUpdateRes) {
                // Handle Speaker update error
                if (speakerUpdateErr) {
                  return done(speakerUpdateErr);
                }

                // Set assertions
                (speakerUpdateRes.body._id).should.equal(speakerSaveRes.body._id);
                (speakerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Speakers if not signed in', function (done) {
    // Create new Speaker model instance
    var speakerObj = new Speaker(speaker);

    // Save the speaker
    speakerObj.save(function () {
      // Request Speakers
      request(app).get('/api/speakers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Speaker if not signed in', function (done) {
    // Create new Speaker model instance
    var speakerObj = new Speaker(speaker);

    // Save the Speaker
    speakerObj.save(function () {
      request(app).get('/api/speakers/' + speakerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', speaker.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Speaker with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/speakers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Speaker is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Speaker which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Speaker
    request(app).get('/api/speakers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Speaker with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Speaker if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Speaker
        agent.post('/api/speakers')
          .send(speaker)
          .expect(200)
          .end(function (speakerSaveErr, speakerSaveRes) {
            // Handle Speaker save error
            if (speakerSaveErr) {
              return done(speakerSaveErr);
            }

            // Delete an existing Speaker
            agent.delete('/api/speakers/' + speakerSaveRes.body._id)
              .send(speaker)
              .expect(200)
              .end(function (speakerDeleteErr, speakerDeleteRes) {
                // Handle speaker error error
                if (speakerDeleteErr) {
                  return done(speakerDeleteErr);
                }

                // Set assertions
                (speakerDeleteRes.body._id).should.equal(speakerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Speaker if not signed in', function (done) {
    // Set Speaker user
    speaker.user = user;

    // Create new Speaker model instance
    var speakerObj = new Speaker(speaker);

    // Save the Speaker
    speakerObj.save(function () {
      // Try deleting Speaker
      request(app).delete('/api/speakers/' + speakerObj._id)
        .expect(403)
        .end(function (speakerDeleteErr, speakerDeleteRes) {
          // Set message assertion
          (speakerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Speaker error error
          done(speakerDeleteErr);
        });

    });
  });

  it('should be able to get a single Speaker that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Speaker
          agent.post('/api/speakers')
            .send(speaker)
            .expect(200)
            .end(function (speakerSaveErr, speakerSaveRes) {
              // Handle Speaker save error
              if (speakerSaveErr) {
                return done(speakerSaveErr);
              }

              // Set assertions on new Speaker
              (speakerSaveRes.body.name).should.equal(speaker.name);
              should.exist(speakerSaveRes.body.user);
              should.equal(speakerSaveRes.body.user._id, orphanId);

              // force the Speaker to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Speaker
                    agent.get('/api/speakers/' + speakerSaveRes.body._id)
                      .expect(200)
                      .end(function (speakerInfoErr, speakerInfoRes) {
                        // Handle Speaker error
                        if (speakerInfoErr) {
                          return done(speakerInfoErr);
                        }

                        // Set assertions
                        (speakerInfoRes.body._id).should.equal(speakerSaveRes.body._id);
                        (speakerInfoRes.body.name).should.equal(speaker.name);
                        should.equal(speakerInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Speaker.remove().exec(done);
    });
  });
});
