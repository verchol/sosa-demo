;(function() {
	'use strict';

	function Feedback($q, $http) {
		var defaults = {
			name: '',
			email: '',
			comment: ''
		};

		function Model(options) {
			angular.extend(this, defaults, options);
		}

		function isEmptyString(value) {
			return typeof value === 'string' && value.length === 0;
		}

		Model.prototype.send = function() {
			return $http.post('/labs/api/submit/comment', { form: this });
		};

		Model.prototype.validate = function() {
			return !isEmptyString(this.name) &&
						 !isEmptyString(this.email) &&
						 !isEmptyString(this.comment);
		};

		return Model;
	}

	function FeedbackWindowCtrl($scope, $modalInstance, Feedback, notify) {
		function onSuccess() {
			notify({
				message: 'Your request has been sent!',
				templateUrl: 'components/notifications/gmail-template.html'
			});
			ga('send', 'event', 'button', 'click', 'labs forms sent: feedback');
		}

		function onError() {
			notify({
				message: 'There was a problem with your request...',
				classes: 'error',
				templateUrl: 'components/notifications/gmail-template.html'
			});
		}

		function onProgress() {
			notify({
				message: 'Form Processing, please wait...',
				templateUrl: 'components/notifications/gmail-template.html'
			});
		}

		$scope.feedback = new Feedback();

		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.send = function() {
			onProgress.call();
			$scope.feedback.send().then(onSuccess, onError);
			$modalInstance.close();
		};
	}

	function FeedbackButtonCtrl($modal) {
		var ctrl = this;
		var params = {
			templateUrl: 'components/feedback/modal.html',
			windowClass: 'greenModal',
			controller: [
				'$scope', '$modalInstance', 'Feedback', 'notify', FeedbackWindowCtrl
			],
			resolve: {
				items: function() {
					return {};
				}
			}
		};
		var instance;

		ctrl.show = function() {
			ga('send', 'event', 'button', 'click', 'labs forms button: feedback');
			instance = $modal.open(params);
		};
	}

	angular
		.module('codeFreshSiteApp')
		.factory('Feedback', ['$q', '$http', Feedback])
		.directive('feedback', function() {
			return {
				scope: {},
				templateUrl: 'components/feedback/button.html',
				controllerAs: 'feedback',
				controller: ['$modal', FeedbackButtonCtrl]
			};
		});

})();
