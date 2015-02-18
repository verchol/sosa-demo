;(function(){
	'use strict';
	angular
		.module('codeFreshSiteApp')
		.controller('FooterCtrl', FooterCtrl)
		.directive('twitterTimeline', [function() {
			return {
				restrict: 'A',
				scope: {
					cssUrl: "@",
					autoResize: "="
				},
				link: function (scope, element, attrs) {
					$('body').removeAttr('data-twttr-rendered');
					element
						.attr('id', 'twitter-feed')
						.attr("width", "100%" || attrs.width)
						.attr('data-chrome', 'noheader transparent')
						.attr('data-widget-id', attrs.twitterTimeline)
						.addClass('twitter-timeline');
					function render() {
						var body = $('.twitter-timeline').contents().find('body');
						if (scope.cssUrl) {
							body.append($('<link/>', { rel: 'stylesheet', href: scope.cssUrl, type: 'text/css' }));
						}
						function setHeight() {
							if (body.find('.stream').length == 0) {
								setTimeout(setHeight, 100);
							} else {
								body.find('.stream').addClass('stream-new').removeClass('stream').css('height', 'auto');
								$('.twitter-timeline').css('height', (body.height() + 20) + 'px');
							}
						}
						if (scope.autoResize) {
							setHeight();
						}
					}
					if (!$('#twitter-wjs').length) {
						$.getScript((/^http:/.test(document.location)?'http':'https') + '://platform.twitter.com/widgets.js', function() {
							render();
							$('.twitter-timeline').load(render);
						});
					}
				}
			};
		}]);

	/* @ngInject */
	function FooterCtrl($scope, $subscribe, $location) {
		// subscribe functionality
		$scope.subscribe = $subscribe;

		$scope.betaRegister = function () {
			ga('send', 'event', 'User Management Beta', 'Sign up button click. (footer.html)');
			$subscribe.send();
		};

	}

}).call(this);
