'use strict';

describe('Directive: voteCard', function () {

  // load the directive's module and view
  beforeEach(module('govtimeApp'));
  beforeEach(module('components/vote-card/vote-card.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<vote-card></vote-card>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the voteCard directive');
  }));
});