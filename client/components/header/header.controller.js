'use strict';

angular.module('govtimeApp')
  .controller('HeaderCtrl', function($scope, NationalService) {
    $scope.updates = NationalService.updates();

  });
