'use strict';

/**
 * Module dependencies
 */
var speakersPolicy = require('../policies/speakers.server.policy'),
  speakers = require('../controllers/speakers.server.controller');

module.exports = function(app) {
  // Speakers Routes
  app.route('/api/speakers').all(speakersPolicy.isAllowed)
    .get(speakers.list)
    .post(speakers.create);

  app.route('/api/speakers/:speakerId').all(speakersPolicy.isAllowed)
    .get(speakers.read)
    .put(speakers.update)
    .delete(speakers.delete);

  // Finish by binding the Speaker middleware
  app.param('speakerId', speakers.speakerByID);
};
