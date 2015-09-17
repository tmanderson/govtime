'use strict';

angular.module('govtimeApp')
  .directive('voteCard', function () {
    return {
      templateUrl: 'components/vote-card/vote-card.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });