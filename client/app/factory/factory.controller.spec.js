'use strict';

describe('Controller: FactoryCtrl', function () {

  // load the controller's module
  beforeEach(module('codeFreshSiteApp'));

  var FactoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
	  FactoryCtrl = $controller('FactoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
