'use strict';

angular.module('govtimeApp')
  .service('StateService', function ($http) {
    var host = 'http://openstates.org/api/v1';

    function requestPath() {
      return host + _.toArray(arguments).join('/');
    }

    return {
      metadata: function(stateAbbr) {
        return $http.get(requestPath('/metadata', stateAbbr));
      },

      bills: function(stateAbbr) {
        return $http.get(requestPath('/bills', stateAbbr));
      },

      legislators: function(legislatorId) {
        return $http.get(requestPath('/legislators', legislatorId));
      },

      committees: function(committeeId) {
        return $http.get(requestPath('/committees', committeeId));
      }
    }
  });
