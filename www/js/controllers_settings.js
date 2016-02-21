/**
 * Created by alexander on 31.01.16.
 */
_control.controller('SettingsCtrl',['$scope','ionicToast','soapHP','settingsHP','$rootScope','$localStorage',
    function($scope, ionicToast, soapHP, settingsHP,$rootScope,$localStorage) {

        $scope.$storage = $localStorage;

        $scope.loginData = settingsHP.getSettings();

        $scope.startPage = [
            {name:'comfort', state:'/app/comfortlist'},
            {name:'status', state:'/app/statuslist'},
            {name:'help', state:'/app/help'},
            {name:'settings', state:'/app/settings'}
        ];

        $scope.startPage.forEach(function(entry, index) {
            if (entry.state === $scope.$storage.startState) {
                $scope.loginData.myStartPage = $scope.startPage[index];
            }
        });

        $scope.hideToast = function(){
            ionicToast.hide();
        };

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'SettingsCtrl') {
                $scope.loginData = settingsHP.getSettings();
            }
        });

        $scope.settingData = {
            majorReleaseNo : 1,
            minorReleaseNo : 1,
            patchLevelNo : 1
        };

        // Save Settings
        $scope.saveSettings = function() {

            $scope.$storage.startState = $scope.loginData.myStartPage.state;

            var promiseSave = settingsHP.setSettings($scope.loginData);
            promiseSave.then(
                function(response) {
                    $scope.loginData = settingsHP.getSettings();
                    ionicToast.show('Settings saved', 'bottom', false, 2000);
                });
        };

    }]);