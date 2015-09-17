'use strict';

describe('Directive: govTicker', function () {

  // load the directive's module and view
  beforeEach(module('govtimeApp'));
  beforeEach(module('components/gov-ticker/gov-ticker.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gov-ticker></gov-ticker>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the govTicker directive');
  }));
});