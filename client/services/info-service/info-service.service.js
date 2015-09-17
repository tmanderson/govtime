'use strict';

angular.module('govtimeApp')
  .service('infoService', function ($resource) {
    return $resource('/api/info', { state: '@state' }, {
      national: {
        method: 'get'
      }
    });
  });
