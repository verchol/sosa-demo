;
(function () {
	'use strict';
	angular
		.module('codeFreshSiteApp')
		.controller('MainCtrl', ['$scope', '$subscribe', MainCtrl]);

	/* @ngInject */
	function MainCtrl($scope, $subscribe) {
		$scope.showHeaderForm = false;
		$scope.toogleShowHeaderForm = function () {
			ga('send', 'event', 'User Management Beta', 'Sign up now for free button click (before sign up) (main.html)');
			$scope.showHeaderForm = !$scope.showHeaderForm;
		};

		$scope.betaRegister = function () {
			ga('send', 'event', 'User Management Beta', 'Sign up button click. (main.html)');
			$subscribe.send();
		};


		//_gaq.push(['_trackEvent', 'CTA', 'Click', 'Subscribe for beta']);


		// subscribe functionality
		$scope.subscribe = $subscribe;

		$scope.testimonials = [
			{
				img:"../assets/images/px.png",
				text:'“In codefresh developers can focus more on what they like most - coding, codefresh will simplify and automate the interaction with all the tools and services development teams need - git commands, code review, tasks, CI, test, monitoring, deployment, hot fixes and more...”'
			},
			{
				img:"../assets/images/testimonials/2.jpg",
				text:'"Codefresh solution fits perfectly my needs. QA and development processes much simpler, we can easily test different environments without the need to deal with IT configurations."'
			}
		];

		$scope.testimonials_rooler = {
			left:"0px"
		};

		var currentTestimonial = 0;
		$scope.nav = function(dir) {
			if(dir == 'left') {
				currentTestimonial--;
			}

			if(dir == 'right') {
				currentTestimonial++;
			}

			if(currentTestimonial<0)
				currentTestimonial=0;
			if(currentTestimonial+1>$scope.testimonials.length)
				currentTestimonial=$scope.testimonials.length-1;

			$scope.testimonials_rooler.left = "-" + currentTestimonial * 800 + "px" ;

		};

	}

}).call(this);
