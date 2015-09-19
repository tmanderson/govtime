'use strict';

angular.module('govtimeApp')
  .service('StateService', function ($resource, apikey) {

    return $resource('/', { apikey: apikey }, {
      metadata: {
        type: 'get',
        url: '/api/states/metadata/:state'
      },
      info: {
        type: 'get',
        url: '/api/info/:state'
      },
      bills: {
        type: 'get',
        url: '/api/states/bills/:state'
      },
      legislators: {
        type: 'get',
        url: '/api/states/legislators/:id',
        isArray: true
      },
      committees: {
        type: 'get',
        url: '/api/states/committees'
      },
      events: {
        type: 'get',
        url: '/api/states/events/:state'
      },
      district: {
        type: 'get',
        url: '/api/states/districts'
      }
    });
  });
