;(function(){
'use strict';
angular
  .module('codeFreshSiteApp')
  .config(Configuration);

  /* @ngInject */
  function Configuration($stateProvider) {
    // Contact state routing
    $stateProvider
      .state('factory', {
        url: '/factory',
        templateUrl: 'app/factory/factory.html',
        controller: 'FactoryCtrl'
      });
  }

}).call(this);
