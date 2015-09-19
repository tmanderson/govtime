'use strict';

angular.module('govtimeApp')
  .controller('MainCtrl', function($scope, $timeout, StateService, states) {
    var national = { name: 'United States of America', abbr: 'usa' };

    $scope.states = states;
    $scope.region = national;

    $scope.setRegion = function setRegion(selectedRegion) {
      if(selectedRegion) {
        StateService.metadata({
          state: selectedRegion.abbr
        }).$promise.then(function(metadata) {
          $scope.region = _.merge(metadata, selectedRegion);
        });
      }
      else {
        $timeout(function() {
          $scope.region = national;
        }, 10);
      }
    };
  });
