'use strict';

describe('Directive: regionCard', function () {

  // load the directive's module and view
  beforeEach(module('govtimeApp'));
  beforeEach(module('components/region-card/region-card.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<region-card></region-card>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the regionCard directive');
  }));
});