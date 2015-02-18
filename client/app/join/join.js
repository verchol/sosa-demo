;(function(){
	'use strict';
	angular
		.module('codeFreshSiteApp')
		.config(Configuration);

	/* @ngInject */
	function Configuration($stateProvider) {
		$stateProvider
			.state('joinus', {
				url: '/join',
				templateUrl: 'app/join/join.html',
				controller: 'JoinCtrl'
			})
	}

}).call(this);
