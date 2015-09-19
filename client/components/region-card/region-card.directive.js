'use strict';

angular.module('govtimeApp')
  .controller('RegionCardController', function($scope, NationalService, StateService) {

    var parties = ['Democrats', 'Republicans', 'Independents'];
    var colours = ['#10b5f8', '#ff5b00', '#EFEFEF'];

    $scope.chambers = [{}, {}];

    $scope.$watch('region', function(region) {

      if(region.abbr === 'usa') {
        /**
         * chart-data, labels, options, series, colours, getColour, click, hover, legend
         * event handles are angular like
         */
        NationalService.legislators({
          fields: 'chamber,active,district,party,leg_id',
          per_page: 'all'
        })
        .$promise
        .then(function(members) {
          var houseMembers = _.filter(members, 'chamber', 'house');
          var senateMembers = _.filter(members, 'chamber', 'senate');

          _.merge($scope.chambers[0], {
            name: 'Senate',
            colours: colours,
            parties: parties,
            members: [
              _.filter(senateMembers, 'party', 'D').length,
              _.filter(senateMembers, 'party', 'R').length,
              _.filter(senateMembers, 'party', 'I').length
            ]
          });

          _.merge($scope.chambers[1], {
            name: 'House',
            colours: colours,
            parties: parties,
            members: [
              _.filter(houseMembers, 'party', 'D').length,
              _.filter(houseMembers, 'party', 'R').length,
              _.filter(houseMembers, 'party', 'I').length
            ]
          });
        });
      }
      else {
        var chambers = region.chambers;

        StateService.legislators({
          fields: 'party,title,chamber',
          per_page: 'all',
          state: region.abbr,
          active: true
        })
        .$promise
        .then(function(legislators) {
          var upLeg = _.filter(legislators, 'chamber', 'upper');
          var lowLeg = _.filter(legislators, 'chamber', 'lower');

          _.merge($scope.chambers[0], {
            name: chambers.upper.name,
            colours: colours,
            parties: parties,
            members: [
              _.filter(upLeg, 'party', 'Democratic').length,
              _.filter(upLeg, 'party', 'Republican').length,
              _.filter(upLeg, 'party', 'Independent').length
            ]
          });

          _.merge($scope.chambers[1], {
            name: chambers.lower.name,
            colours: colours,
            parties: parties,
            members: [
              _.filter(lowLeg, 'party', 'Democratic').length,
              _.filter(lowLeg, 'party', 'Republican').length,
              _.filter(lowLeg, 'party', 'Independent').length,
            ]
          });
        });

        $scope.info = StateService.info({
          state: region.name
        });
      }
    });
  })
  .directive('regionCard', function () {
    return {
      controller: 'RegionCardController',
      templateUrl: 'components/region-card/region-card.html',
      restrict: 'EA',
      scope: {
        region: '='
      },
      link: function ($scope, element, attrs) {

      }
    };
  });
