'use strict';

angular.module('govtimeApp')
  .directive('idCard', function () {
    return {
      templateUrl: 'components/id-card/id-card.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });