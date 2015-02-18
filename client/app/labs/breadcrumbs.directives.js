(function () {
	'use strict';
	var myApp = angular.module('codeFreshSiteApp');

	myApp.directive('breadcrumbs', ['$http', function ($http) {
		var spinnerId = 1;

		var directive = {
			restrict: 'AE',
			controller: controller,
			template: '<div ng-repeat="l in breadcrumbs"><a ng-class="{link:l.func}" ng-click="l.func()">{{l.text}}</a><span ng-show="!$last">&nbsp;</span></div>'
		};

		function controller($scope) {

		}

		function link(scope, element, attr) {

		}

		return directive;

	}]);

}).call(this);
