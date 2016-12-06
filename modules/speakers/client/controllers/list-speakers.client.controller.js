(function () {
  'use strict';

  angular
    .module('speakers')
    .controller('SpeakersListController', SpeakersListController);

  SpeakersListController.$inject = ['SpeakersService'];

  function SpeakersListController(SpeakersService) {
    var vm = this;

    vm.speakers = SpeakersService.query();
  }
}());
