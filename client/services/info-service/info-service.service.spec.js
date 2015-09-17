'use strict';

describe('Service: infoService', function () {

  // load the service's module
  beforeEach(module('govtimeApp'));

  // instantiate service
  var infoService;
  beforeEach(inject(function (_infoService_) {
    infoService = _infoService_;
  }));

  it('should do something', function () {
    expect(!!infoService).toBe(true);
  });

});
