;(function(){
'use strict';
angular
  .module('codeFreshSiteApp')
  .controller('NavbarCtrl', NavbarCtrl);

  /* @ngInject */
  function NavbarCtrl($scope, $location) {
    $scope.menu = [
    {
      	'title': 'Product',
      	'link': '/product',
		'class': ''
    },
    {
      	'title': 'Labs',
      	'link': '/labs',
		'class': 'new'
    },
    {
      	'title': 'Contact us',
      	'link': '/contact',
		'class': ''
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }

}).call(this);
