'use strict';

describe('Service: geoService', function () {

  // load the service's module
  beforeEach(module('govtimeApp'));

  // instantiate service
  var geoService;
  beforeEach(inject(function (_geoService_) {
    geoService = _geoService_;
  }));

  it('should do something', function () {
    expect(!!geoService).toBe(true);
  });

});
