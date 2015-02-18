(function () {
	'use strict';
	angular
		.module('codeFreshSiteApp', [
			'ngCookies',
			'ngResource',
			'ngSanitize',
			'ngAnimate',
			'ui.router',
			'ui.bootstrap',
			'cgNotify'
		])
		.config(Configuration)
		.run(function ($state, $rootScope, $stateParams, $global_services, Environment) {
			// used for content styles
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;



			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
				$global_services.track();
			});
		});

	/* @ngInject */
	function Configuration($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/');

		$locationProvider.html5Mode(true);
	}


	var labsDirectives = angular.module('labsDirectives', []);

}).call(this);
