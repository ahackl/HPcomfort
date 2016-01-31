var _control = angular.module('starter.controllers', ['starter.services']);

_control.controller('AppCtrl',['$scope','ionicToast','soapHP','settingHP','$rootScope',
  function($scope, ionicToast, soapHP, settingHP,$rootScope) {


    document.addEventListener("resume", function() {
      getTempValue();
    }, false);


      $scope.loginData = settingHP.getSettings();
      getTempValue();



    $scope.wp = {
      temp: 0.0,
      id: 0
    };

  $scope.ngButtonMarked = [];
  $scope.ngButtonText = [];
  for (var i = 0; i <= 12; i++) {
    $scope.ngButtonMarked.push(false);
    $scope.ngButtonText.push(3.0 - 0.5 * i);
  }

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (toState.views.menuContent.controller === 'AppCtrl') {
          getTempValue();
      }
  });





  function setTempValue(newTempValue) {
    var promiseSave = soapHP.sendSOAPwithValue($scope.loginData, $scope.loginData.oidComfort, newTempValue);
    promiseSave.then(
        function(answer) {
          $scope.LogText = answer.data;
          getTempValue();
        },
        function(error) {
          $scope.LogText = error.data;
        });

  }

  function getTempValue() {
      var promise = soapHP.sendSOAP($scope.loginData, $scope.loginData.oidComfort);
      promise.then(
          function(answer) {
              $scope.wp.temp =  soapHP.getValue(answer);
              $scope.ngButtonMarked[$scope.wp.id] = false;
              $scope.wp.id = 6.0 - 2.0 * $scope.wp.temp;
              $scope.ngButtonMarked[$scope.wp.id] = true;
          },
          function(error) {
              $scope.ngButtonMarked[$scope.wp.id] = false;
              $scope.LogText = error.data;
          });
  }


  $scope.ngButtonClick = function(buttonIndex) {
    var newTempValue = 3.0 - 0.5 * buttonIndex;
    setTempValue(newTempValue);
  };



}]);


