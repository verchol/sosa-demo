;(function(){
'use strict';
angular
  .module('codeFreshSiteApp')
  .controller('JoinCtrl', ['$scope', '$team', JoinCtrl]);

  /* @ngInject */
  function JoinCtrl($scope, $team) {
    $scope.team = $team.members;


  }

}).call(this);
