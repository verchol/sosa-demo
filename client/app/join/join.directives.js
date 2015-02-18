(function () {
	'use strict';
	var myApp = angular.module('codeFreshSiteApp');

	myApp.directive('member', [function memberDirective() {
		// directive definition object
		return {
			restrict: 'EA',
			scope: {
				data: '=data'
			},
			template: "<div><img ng-src='{{data.image}}'> <h1>{{data.name}}<h1></div>",
			link: function ($scope, $element) {
				//$element.text('Planet: ' + planetName);
			}
		}
	}]);

}).call(this);
