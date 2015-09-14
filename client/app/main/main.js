'use strict';

angular.module('govtimeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          stateData: function($http) {
            return $http.get('data/states.json')
              .then(function(res) {
                return res.data;
              });
          }
        }
      });
  });
