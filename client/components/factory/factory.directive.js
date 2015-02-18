;(function() {
	'use strict';

	function selectOnClick() {
		return {
			restrict: 'A',
			link: ['$element', function($element) {
				$element.on('click', function() {
					this.select();
				});
			}]
		};
	}

	function Factory($q, $http, $timeout, Environment, Socket) {
		var uid, onProgressCallback;

		function _init(onProgressHandler) {
			uid = _generateUID();

			return Socket.init().then(function(socket) {
				socket.on(uid, function(data) {
					$timeout(onProgressHandler.bind(null, data));
				});
			});
		}

		function _generateUID() {
			return '' + Date.now() + Math.random();
		}

		function create(options, onProgressHandler) {
			return _init(onProgressHandler).then(function() {
				var deferred = $q.defer();

				Environment.get(function(err, res) {
					if (err) {
						return deferred.reject([err]);
					}

					$http
						.get(res.ide.url + '/factory?git=' + options.url + '&uid=' + uid)
						.success(function(response) {
							deferred.resolve(response);
						})
						.error(function(response) {
							deferred.reject(response.errors);
						});
				});

				return deferred.promise;
			});
		}

		return {
			create: create
		};
	}

	function Socket($q, Environment) {
		var socket;

		this.init = function() {
			var deferred = $q.defer();

			Environment.get(function(err, res) {
				if (err) {
					return deferred.reject(err);
				}

				socket = io.connect(res.ide.url, { reconnect: true });

				socket.on('connect', function(socket) {
					console.log('Connected!');
				});

				deferred.resolve(socket);
			});

			return deferred.promise;
		};

		this.get = function() {
			return socket;
		};
	}

	function FactoryCtrl($global_services, Factory, notify) {
		var ctrl = this;
		var actions = [
			{
				name: 'Checking git URL'
			},
			{
				name: 'Cloning your repository'
			},
			{
				name: 'Analyzing repository structure'
			},
			{
				name: 'Go'
			}
		];

		$global_services.preloader([
			'assets/images/go.png',
			'assets/images/new/loader-unit.gif',
			'assets/images/codefresh-small-leaf.png',
			'assets/images/preloader64.gif'
		]);

		function onProgress(data) {
			var actions = data.actions;

			angular.forEach(actions, function(action, index) {
				ctrl.actions[action.stage][action.key] = action.value;
			});
		}

		function onError(errors) {
			angular.forEach(ctrl.actions, function(action) {
				if (action.status === 'in-progress') {
					action.status = 'aborted';
				}
			});

			angular.forEach(errors, function(error) {
				notify({
					message: error,
					classes: 'error',
					templateUrl: 'components/notifications/gmail-template.html'
				});
			});
		}

		function onSuccess(response) {
			var warnings = response.warnings;

			if ( warnings.length ) {
				angular.forEach(warnings, function(warning) {
					notify({
						message: warning,
						classes: 'warning',
						templateUrl: 'components/notifications/gmail-template.html'
					});
				});
			}

			ctrl.factoryURL = response.factoryURL;
		}

		ctrl.create = function() {
			ctrl.actions = angular.copy(actions);
			ctrl.factoryURL = null;

			Factory
				.create({ url: ctrl.url }, onProgress)
				.then(onSuccess, onError);
		};
	}

	angular
		.module('codeFreshSiteApp')


	angular
		.module('codeFreshSiteApp')
		.service('Socket', ['$q', 'Environment', Socket])
		.factory('Factory', ['$q', '$http', '$timeout', 'Environment', 'Socket', Factory])
		.directive('selectOnClick', selectOnClick)
		.directive('factory', function() {
			return {
				scope: {},
				templateUrl: 'components/factory/template.html',
				controllerAs: 'factory',
				controller: ['$global_services', 'Factory', 'notify', FactoryCtrl]
			};
		});

})();
