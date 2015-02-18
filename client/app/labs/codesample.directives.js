(function () {
	'use strict';
	var myApp = angular.module('codeFreshSiteApp');

	myApp.directive('codecategory', function() {
		return {
			restrict: 'EA',
			transclude: false,
			scope: {
				templateUrl: '@',
				category: '=categoryObj',
				searchCode: '&'
			},
			template: "<div ng-class='wr_class' class='transparent' ng-include='templateUrl'></div>",
			//template: "<div>category:{{category}}</div>",
			link: function(scope, element, attr, ctrl, transclude){
				scope.ide_ready = false;
				scope.wr_class = "";
				scope.categoryCodeIt = function(category_id) {
					scope.wr_class = "processing";
					ga('send', 'event', 'Labs', 'Code it! button click.', category_id);

					setTimeout(function() {
						angular.element('#'+category_id+" button").trigger('click');
					}, 100);
				}
			}

		};
	});

	myApp.directive('codesample', function() {
		return {
			restrict: 'EA',
			transclude: false,
			scope: {
				templateUrl: '@',
				sample: '=sampleObj'
			},
			template: "<div class='transparent' ng-include='templateUrl'></div>",
			link: function(scope, element, attr, ctrl, transclude){

			}

		};
	});

}).call(this);
