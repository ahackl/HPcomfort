_control.controller('ComfortDetailCtrl',['$scope','$stateParams','$localStorage','$rootScope', 'networkHP','soapHP',
    function($scope, $stateParams, $localStorage,$rootScope,networkHP,soapHP  ) {

        $scope.$storage = $localStorage;


        $scope.comfortItem = [];




        $scope.$watch('$storage.lastConnectedServerlastConnectedServer', function() {
            getTempValue();
        });

        $scope.valueChanged = function(){
            $scope.update = $scope.model.myNumber;
        }

        // reload data if the view is resumed from background
        document.addEventListener("resume", function () {
            getTempValue();
        }, false);


        // reload data if the view is resumed from another state
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'ComfortDetailCtrl') {
                getTempValue();
            }
        });

        // reload data if the scroll down function is used
        $scope.doRefresh = function () {
            getTempValue();
            $scope.$broadcast('scroll.refreshComplete');
        };

        // remember the last temp and the number of the selected button.
        $scope.wp = {
            temp: 0.0,
            id: 0
        };


        // get temperature at startup
        getTempValue();

        // send the new temperature value
        function setTempValue(newTempValue) {
            var promiseSave = soapHP.sendSOAPwithValue($scope.$storage, $scope.comfortItem.soapid, newTempValue);
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

            if ($stateParams.Cindex >= 0 || $stateParams.Cindex < $scope.$storage.comfortlist.length) {
                $scope.comfortItem = $scope.$storage.comfortlist[$stateParams.Cindex];
            }


            var minValue =  parseFloat($scope.comfortItem.minValue);
            var maxValue =  parseFloat($scope.comfortItem.maxValue);
            var stepSize =  parseFloat($scope.comfortItem.stepSize);
            if (stepSize === 0) {
                stepSize = 1;
            }

            // prepare the button list
            $scope.ngButtonMarked = [];
            $scope.ngButtonText = [];

            var NoOfButtons = (maxValue - minValue) /  stepSize;

            for (var i = 0; i <= NoOfButtons; i++) {
                $scope.ngButtonMarked.push(false);
                $scope.ngButtonText.push(maxValue - stepSize * i);
            }

            networkHP.checkConnection();

            var promise = soapHP.sendSOAP($scope.$storage, $scope.comfortItem.soapid);
            promise.then(
                function (answer) {
                    // $scope.wp.temp =  soapHP.getValue(answer);
                    $scope.ngButtonMarked[$scope.wp.id] = false;
                    $scope.wp.id = (maxValue - soapHP.getValue(answer) ) / stepSize;
                    $scope.ngButtonMarked[$scope.wp.id] = true;
                },
                function (error) {
                    $scope.ngButtonMarked[$scope.wp.id] = false;
                    $scope.LogText = error.data;
                });
        }

        // initiate the change of the temperature value
        $scope.ngButtonClick = function (buttonIndex) {



            var minValue =  parseFloat($scope.comfortItem.minValue);
            var maxValue =  parseFloat($scope.comfortItem.maxValue);
            var stepSize =  parseFloat($scope.comfortItem.stepSize);

            var newTempValue = maxValue - stepSize * buttonIndex;

            setTempValue(newTempValue);
        };


        
    }]);



