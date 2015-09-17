'use strict';

angular.module('govtimeApp')
  .controller('MainCtrl', function($scope, NationalService, map) {
    $scope.region = "national";
  });
