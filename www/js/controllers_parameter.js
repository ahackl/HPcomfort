/**
 * Created by alexander on 31.01.16.
 */
_control.controller('ParameterCtrl',['$scope','$http','ionicToast','soapHP','settingHP','$rootScope',
    function($scope, $http, ionicToast, soapHP, settingHP, $rootScope) {

        $scope.loginData = settingHP.getSettings();
        getParameterValue();

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'ParameterCtrl') {
                getParameterValue();
            }
        });

        function getParameterValue() {
            var promise = soapHP.sendSOAP($scope.loginData, '1/2/7/121/1');
            promise.then(
                function(response) {
                    //console.log(JSON.stringify(response));
                    $scope.parameter =  soapHP.getValue(response);
                },
                function(error) {
                    //console.log(JSON.stringify(error));
                    $scope.parameter =  '--';
                });
        }

    }]);
