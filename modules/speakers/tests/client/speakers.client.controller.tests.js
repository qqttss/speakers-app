(function () {
  'use strict';

  describe('Speakers Controller Tests', function () {
    // Initialize global variables
    var SpeakersController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SpeakersService,
      mockSpeaker;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SpeakersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SpeakersService = _SpeakersService_;

      // create mock Speaker
      mockSpeaker = new SpeakersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Speaker Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Speakers controller.
      SpeakersController = $controller('SpeakersController as vm', {
        $scope: $scope,
        speakerResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleSpeakerPostData;

      beforeEach(function () {
        // Create a sample Speaker object
        sampleSpeakerPostData = new SpeakersService({
          name: 'Speaker Name'
        });

        $scope.vm.speaker = sampleSpeakerPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (SpeakersService) {
        // Set POST response
        $httpBackend.expectPOST('api/speakers', sampleSpeakerPostData).respond(mockSpeaker);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Speaker was created
        expect($state.go).toHaveBeenCalledWith('speakers.view', {
          speakerId: mockSpeaker._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/speakers', sampleSpeakerPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Speaker in $scope
        $scope.vm.speaker = mockSpeaker;
      });

      it('should update a valid Speaker', inject(function (SpeakersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/speakers\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('speakers.view', {
          speakerId: mockSpeaker._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (SpeakersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/speakers\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Speakers
        $scope.vm.speaker = mockSpeaker;
      });

      it('should delete the Speaker and redirect to Speakers', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/speakers\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('speakers.list');
      });

      it('should should not delete the Speaker and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
