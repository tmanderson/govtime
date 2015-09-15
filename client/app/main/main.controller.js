'use strict';

angular.module('govtimeApp')
  .controller('MainCtrl', function($scope, NationalService) {
    $scope.bills = NationalService.bills();
    console.log($scope.bills);
  });
