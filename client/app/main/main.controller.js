'use strict';

angular.module('govtimeApp')
  .controller('MainCtrl', function($scope, NationalService, map) {
    $scope.context = NationalService.context();
  })
  .filter('pick', function() {
    return function(info, field/*, field...*/) {
      _.pick.apply(_, arguments)
    }
  })
