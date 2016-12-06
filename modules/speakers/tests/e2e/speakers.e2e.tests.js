'use strict';

describe('Speakers E2E Tests:', function () {
  describe('Test Speakers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/speakers');
      expect(element.all(by.repeater('speaker in speakers')).count()).toEqual(0);
    });
  });
});
