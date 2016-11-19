/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','$localStorage','$rootScope','networkHP',
    function($scope, $localStorage, $rootScope, networkHP) {

        $scope.$storage = $localStorage;

        $scope.appVersion = '1.5.1';

        $scope.doRefresh = function() {
            networkHP.checkConnection();
            $scope.$broadcast('scroll.refreshComplete');
        };

    }]);