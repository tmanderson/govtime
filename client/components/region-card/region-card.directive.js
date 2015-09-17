'use strict';

angular.module('govtimeApp')
  .controller('RegionCardController', function($scope, NationalService, StateService) {
    if($scope.region === 'national') {
      $scope.regionName = 'United States of America';
      $scope.chambers = [];

      var parties = ['Democrats', 'Republicans', 'Independents'];
      var colours = ['#10b5f8', '#ff5b00', '#EFEFEF'];

      /**
       * chart-data, labels, options, series, colours, getColour, click, hover, legend
       * event handles are angular like
       */
      NationalService.legislators({
        fields: 'in_office,party,state_rank,title,chamber',
        per_page: 'all'
      })
      .$promise
      .then(function(members) {
        var houseMembers = _.filter(members, 'chamber', 'house');
        var senateMembers = _.filter(members, 'chamber', 'senate');

        $scope.chambers.push({
          name: 'House',
          colours: colours,
          parties: parties,
          members: [
            _.filter(houseMembers, 'party', 'D').length,
            _.filter(houseMembers, 'party', 'R').length,
            _.filter(houseMembers, 'party', 'I').length
          ]
        });

        $scope.chambers.push({
          name: 'Senate',
          colours: colours,
          parties: parties,
          members: [
            _.filter(senateMembers, 'party', 'D').length,
            _.filter(senateMembers, 'party', 'R').length,
            _.filter(senateMembers, 'party', 'I').length
          ]
        });
      });
    }
  })
  .directive('regionCard', function () {
    return {
      controller: 'RegionCardController',
      templateUrl: 'components/region-card/region-card.html',
      restrict: 'EA',
      link: function ($scope, element, attrs) {

      }
    };
  });
