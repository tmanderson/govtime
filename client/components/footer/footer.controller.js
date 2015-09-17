'use strict';

angular.module('govtimeApp')
  .controller('FooterCtrl', function ($scope, NationalService) {
    $scope.updates = NationalService.updates();
  });
