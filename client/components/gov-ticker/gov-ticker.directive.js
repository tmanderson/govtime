'use strict';

angular.module('govtimeApp')
  .directive('govTicker', function () {
    return {
      templateUrl: 'components/gov-ticker/gov-ticker.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });