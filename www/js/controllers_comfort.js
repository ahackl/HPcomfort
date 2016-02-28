_control.controller('ComfortCtrl',
    ['$scope', 'soapHP', '$localStorage', '$rootScope',
        function ($scope, soapHP, $localStorage, $rootScope) {

            $scope.$storage = $localStorage;

            // reload data if the view is resumed from background
            document.addEventListener("resume", function () {
                getTempValue();
            }, false);

            // reload data if the view is resumed from another state
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.views.menuContent.controller === 'ComfortCtrl') {
                    getTempValue();
                }
            });

            // reload data if the scroll down function is used
            $scope.doRefresh = function () {
                getTempValue();
                $scope.$broadcast('scroll.refreshComplete');
            };

            // remember the last temp and the number of the button.
            $scope.wp = {
                temp: 0.0,
                id: 0
            };

            // prepare the button list
            $scope.ngButtonMarked = [];
            $scope.ngButtonText = [];
            for (var i = 0; i <= 12; i++) {
                $scope.ngButtonMarked.push(false);
                $scope.ngButtonText.push(3.0 - 0.5 * i);
            }

            // get temperature at startup
            getTempValue();

            // send the new temperature value
            function setTempValue(newTempValue) {
                var promiseSave = soapHP.sendSOAPwithValue($scope.$storage, $scope.$storage.oidComfort, newTempValue);
                promiseSave.then(
                    function (answer) {
                        $scope.LogText = answer.data;
                        getTempValue();
                    },
                    function (error) {
                        $scope.LogText = error.data;
                    });
            }

            // read the temperature value
            function getTempValue() {

                var promise = soapHP.sendSOAP($scope.$storage, $scope.$storage.oidComfort);
                promise.then(
                    function (answer) {
                        // $scope.wp.temp =  soapHP.getValue(answer);
                        $scope.ngButtonMarked[$scope.wp.id] = false;
                        $scope.wp.id = 6.0 - 2.0 * soapHP.getValue(answer);
                        $scope.ngButtonMarked[$scope.wp.id] = true;
                    },
                    function (error) {
                        $scope.ngButtonMarked[$scope.wp.id] = false;
                        $scope.LogText = error.data;
                    });
            }

            // initiate the change of the temperature value
            $scope.ngButtonClick = function (buttonIndex) {
                var newTempValue = 3.0 - 0.5 * buttonIndex;
                setTempValue(newTempValue);
            };


        }]);


