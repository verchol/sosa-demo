'use strict';

describe('Controller: ProductCtrl', function () {

  // load the controller's module
  beforeEach(module('codeFreshSiteApp'));

  var ProductCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductCtrl = $controller('ProductCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
