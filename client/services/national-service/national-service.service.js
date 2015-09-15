'use strict';

angular.module('govtimeApp')
  .factory('NationalService', function ($resource, apikey) {
    var host = 'https://congress.api.sunlightfoundation.com';

    function requestPath() {
      return host + _.toArray(arguments).join('/');
    }

    function transformResponse(data) {
      return angular.fromJson(data).results;
    }

    return $resource(host, { apikey: apikey }, {
      hearings: {
        url: requestPath('/hearings'),
        method: 'get',
        transformResponse: transformResponse,
        isArray: true
      },

      updates: {
        url: requestPath('/floor_updates'),
        method: 'get',
        transformResponse: transformResponse,
        isArray: true
      },

      votes:{
        url: requestPath('/votes'),
        method: 'get',
        transformResponse: transformResponse,
        isArray: true
      },

      bills: {
        url: requestPath('/bills'),
        method: 'get',
        transformResponse: transformResponse,
        isArray: true
      },

      legislators: {
        url: requestPath('/legislators'),
        method: 'get',
        transformResponse: transformResponse,
        isArray: true
      },

      committees: {
        url: requestPath('/committees'),
        method: 'get',
        transformResponse: transformResponse,
        isArray: true
      }
    });
  });
