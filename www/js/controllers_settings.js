/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','ionicToast','soapHP','settingsHP','$rootScope',
    function($scope, ionicToast, soapHP, settingsHP,$rootScope) {

        $scope.hideToast = function(){
            ionicToast.hide();
        };

        $scope.loginData = settingsHP.getSettings();

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'SettingsCtrl') {
                $scope.loginData = settingsHP.getSettings();
            }
        });

        $scope.settingData = {
            majorReleaseNo : 1,
            minorReleaseNo : 1,
            patchLevelNo : 0
        };

        // Save Settings
        $scope.saveSettings = function() {
            var promiseSave = settingsHP.setSettings($scope.loginData);
            promiseSave.then(
                function(response) {
                    $scope.loginData = settingsHP.getSettings();
                    ionicToast.show('Settings saved', 'bottom', false, 2000);
                });
        };

    }]);