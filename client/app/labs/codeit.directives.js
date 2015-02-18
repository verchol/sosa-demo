(function () {
	'use strict';
	var myApp = angular.module('codeFreshSiteApp');

	myApp.directive('codeit', ['$http',function() {
		return {
			restrict: 'EA',
			template: '<button type="button" class="btn {{codeButton.bstyle}} {{codeButton.bsize}}" ng-click="codeit()">{{codeButton.title}}</button>',
			scope: {
				bstyle: '@',
				bsize: '@',
				exampleId: '@exId',
				ideReadyFlag: '='
			},
			link: function(scope, element, attr, ctrl, transclude){

			},
			controller: function($scope,$http) {
				var codeButton = {};
				$scope.codeButton = codeButton;
				codeButton.title = "Code It!";
				codeButton.status = "init";

				codeButton.bstyle = $scope.bstyle ? $scope.bstyle : "";
				codeButton.bsize = $scope.bsize ? $scope.bsize : "";



				//alert($scope.ide_ready);
				$scope.codeit = function () {

					if (codeButton.status === "inprogress") {
						alert("In progress...");
						return;
					}

					if (codeButton.status === "ready") {
						$scope.ideReadyFlag =codeButton.url;
						//window.open(codeButton.url, "_blank");
						return;
					}

					//cfpLoadingBar.start();
					//console.log("start animation");
					codeButton.bstyle = "loading";

					codeButton.title = "Setting environment";
					codeButton.status = "inprogress";
					$http.post('labs/api/env_pr', {id:$scope.exampleId}).
						then(function(response) {
							// success
							codeButton.status = "ready";
							$scope.deploy = response.data;
							$scope.deploy.title = "workspace is ready";

							codeButton.bstyle = "btn-success";
							$scope.codeButton.title = "Ready to code!"
							codeButton.url = response.data.url;
							$scope.ideReadyFlag = response.data.url;
						},
						function(response) { // optional
							// failed
							codeButton.title = "Error!";
							codeButton.status = "init";
							codeButton.bstyle = "btn-danger";
							//alert("error: " + response.data);
						}
					);
				}
			}


		};
	}]);

}).call(this);
