/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','$localStorage','$rootScope','$interval','networkHP',
    function($scope, $localStorage, $rootScope, $interval, networkHP) {

        var checkConnectionInterval = undefined;
        checkConnectionInterval = $interval(checkConnection, 2000);

        $scope.$storage = $localStorage;

        $scope.appVersion = '1.4.1';


        $scope.networkState = 'unknown';
        $scope.wifiSSID = '';
        $scope.useInternalServer = false;
        checkConnection();


        // reload data if the view is resumed from background
        document.addEventListener("resume", function () {
            networkHP.start();
            if (angular.isUndefined(checkConnectionInterval)) {
                checkConnectionInterval = $interval(checkConnection, 2000);
            }
        }, false);
        // reload data if the view is resumed from background
        document.addEventListener("pause", function () {
            networkHP.stop();
            if (angular.isDefined(checkConnectionInterval)) {
                $interval.cancel(checkConnectionInterval);
                checkConnectionInterval = undefined;
            }
        }, false);

        // reload data if the view is resumed from another state
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'SettingsCtrl') {
                if (angular.isUndefined(checkConnectionInterval)) {
                    checkConnectionInterval = $interval(checkConnection, 2000);
                }
            }
            if (toState.views.menuContent.controller != 'SettingsCtrl') {
                if (angular.isDefined(checkConnectionInterval)) {
                    $interval.cancel(checkConnectionInterval);
                    checkConnectionInterval = undefined;
                }
            }
        });


        function checkConnection() {
            $scope.networkState = networkHP.getNetworkState();
            $scope.wifiSSID = networkHP.getSSID();
            $scope.useInternalServer = networkHP.useInternalServer();

        }





    }]);