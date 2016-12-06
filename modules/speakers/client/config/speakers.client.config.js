(function () {
  'use strict';

  angular
    .module('speakers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Speakers',
      state: 'speakers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'speakers', {
      title: 'List Speakers',
      state: 'speakers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'speakers', {
      title: 'Create Speaker',
      state: 'speakers.create',
      roles: ['user']
    });
  }
}());
