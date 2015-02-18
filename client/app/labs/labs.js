;(function(){
'use strict';
angular
  .module('codeFreshSiteApp')
  .config(Configuration);

  /* @ngInject */
  function Configuration($stateProvider) {
    $stateProvider
      .state('labs', {
          url: '/labs',
          templateUrl: 'app/labs/labs.html',
          controller: 'LabsCtrl'
        }
        )
		.state('labs_api', {
			url: '/labs/api/env/:image_id',
			templateUrl: 'app/labs/labs_api.html',
			controller: 'LabsCtrl'
		}
	);
  }

}).call(this);
