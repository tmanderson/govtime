'use strict';

describe('Service: nationalService', function () {

  // load the service's module
  beforeEach(module('govtimeApp'));

  // instantiate service
  var nationalService;
  beforeEach(inject(function (_nationalService_) {
    nationalService = _nationalService_;
  }));

  it('should do something', function () {
    expect(!!nationalService).toBe(true);
  });

});
