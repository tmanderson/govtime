'use strict';

angular.module('govtimeApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        views: {
          header: {
            controller: 'HeaderCtrl',
            templateUrl: 'components/header/header.html'
          },
          content: {
            controller: 'MainCtrl',
            templateUrl: 'app/main/main.html'
          },
          footer: {
            controller: 'FooterCtrl',
            templateUrl: 'components/footer/footer.html'
          }
        },
        resolve: {
          states: function($http) {
            return $http.get('/data/states.json')
              .then(function(res) {
                return res.data;
              });
          }
        }
      });
  });
