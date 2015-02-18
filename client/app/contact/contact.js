;(function(){
'use strict';
angular
  .module('codeFreshSiteApp')
  .config(Configuration);

  /* @ngInject */
  function Configuration($stateProvider) {
    // Contact state routing
    $stateProvider
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/contact/contact.html',
        controller: 'ContactCtrl'
      });
  }

}).call(this);
