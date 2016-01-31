/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','ionicToast','soapHP','settingHP','$rootScope',
    function($scope, ionicToast, soapHP, settingHP,$rootScope) {

        $scope.loginData = settingHP.getSettings();

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'SettingsCtrl') {
                $scope.loginData = settingHP.getSettings();
            }
        });

        $scope.settingData = {
            majorReleaseNo : 1,
            minorReleaseNo : 1,
            patchLevelNo : 0
        };

        // Save Settings
        $scope.saveSettings = function() {
            var promiseSave = settingHP.setSettings($scope.loginData);
            promiseSave.then(
                function(response) {
                    console.log(JSON.stringify(response));
                    $scope.loginData = settingHP.getSettings();
                    ionicToast.show('Settings saved', 'bottom', false, 2000);
                });
        };

    }]);