(function () {
  'use strict';

  // Speakers controller
  angular
    .module('speakers')
    .controller('SpeakersController', SpeakersController);

  SpeakersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'speakerResolve'];

  function SpeakersController ($scope, $state, $window, Authentication, speakerResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.speaker = speakerResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Speaker
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.speaker.$remove($state.go('speakers.list'));
      }
    }

    // Save Speaker
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.speakerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.speaker._id) {
        vm.speaker.$update(successCallback, errorCallback);
      } else {
        vm.speaker.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('speakers.view', {
          speakerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
