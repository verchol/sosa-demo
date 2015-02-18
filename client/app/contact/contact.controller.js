;(function(){
'use strict';
angular
  .module('codeFreshSiteApp')
  .controller('ContactCtrl', ['$scope', '$contactus', ContactCtrl]);

  /* @ngInject */
  function ContactCtrl($scope, $contactus) {
    // Controller Logic
    $scope.contactus = $contactus;
  }

}).call(this);
