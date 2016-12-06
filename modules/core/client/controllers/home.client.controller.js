'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SpeakersService',
    function($scope, Authentication, SpeakersService) {
        // This provides Authentication context.
      $scope.authentication = Authentication;
      $scope.find = function() {
        $scope.speakers = SpeakersService.query();
      };
    }
]);
