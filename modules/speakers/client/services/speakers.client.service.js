// Speakers service used to communicate Speakers REST endpoints
(function () {
  'use strict';

  angular
    .module('speakers')
    .factory('SpeakersService', SpeakersService);

  SpeakersService.$inject = ['$resource'];

  function SpeakersService($resource) {
    return $resource('api/speakers/:speakerId', {
      speakerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
