(function () {
  'use strict';

  describe('Speakers Route Tests', function () {
    // Initialize global variables
    var $scope,
      SpeakersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SpeakersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SpeakersService = _SpeakersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('speakers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/speakers');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SpeakersController,
          mockSpeaker;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('speakers.view');
          $templateCache.put('modules/speakers/client/views/view-speaker.client.view.html', '');

          // create mock Speaker
          mockSpeaker = new SpeakersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Speaker Name'
          });

          // Initialize Controller
          SpeakersController = $controller('SpeakersController as vm', {
            $scope: $scope,
            speakerResolve: mockSpeaker
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:speakerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.speakerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            speakerId: 1
          })).toEqual('/speakers/1');
        }));

        it('should attach an Speaker to the controller scope', function () {
          expect($scope.vm.speaker._id).toBe(mockSpeaker._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/speakers/client/views/view-speaker.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SpeakersController,
          mockSpeaker;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('speakers.create');
          $templateCache.put('modules/speakers/client/views/form-speaker.client.view.html', '');

          // create mock Speaker
          mockSpeaker = new SpeakersService();

          // Initialize Controller
          SpeakersController = $controller('SpeakersController as vm', {
            $scope: $scope,
            speakerResolve: mockSpeaker
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.speakerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/speakers/create');
        }));

        it('should attach an Speaker to the controller scope', function () {
          expect($scope.vm.speaker._id).toBe(mockSpeaker._id);
          expect($scope.vm.speaker._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/speakers/client/views/form-speaker.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SpeakersController,
          mockSpeaker;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('speakers.edit');
          $templateCache.put('modules/speakers/client/views/form-speaker.client.view.html', '');

          // create mock Speaker
          mockSpeaker = new SpeakersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Speaker Name'
          });

          // Initialize Controller
          SpeakersController = $controller('SpeakersController as vm', {
            $scope: $scope,
            speakerResolve: mockSpeaker
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:speakerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.speakerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            speakerId: 1
          })).toEqual('/speakers/1/edit');
        }));

        it('should attach an Speaker to the controller scope', function () {
          expect($scope.vm.speaker._id).toBe(mockSpeaker._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/speakers/client/views/form-speaker.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
