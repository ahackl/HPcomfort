/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','$localStorage',
    function($scope, $localStorage) {

        $scope.$storage = $localStorage;

        $scope.appVersion = '1.2.1';


    }]);