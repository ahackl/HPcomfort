/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','$localStorage','$cordovaNetwork','$rootScope','$interval',
    function($scope, $localStorage, $cordovaNetwork, $rootScope, $interval) {

        $interval(checkConnection, 2500);

        $scope.$storage = $localStorage;

        $scope.appVersion = '1.4.0';


        $scope.networkState = 'unknown';
        checkConnection();

        // reload data if the view is resumed from background
        document.addEventListener("resume", function () {
            checkConnection();
        }, false);
        // reload data if the view is resumed from another state
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'SettingsCtrl') {
                checkConnection();
            }
        });


        function checkConnection() {
            try {
                $scope.networkState = $cordovaNetwork.getNetwork();
            }
            catch(err) {
                $scope.networkState = 'unknown';
            }
        };

    }]);