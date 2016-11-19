/**
 * Created by alexander on 31.01.16.
 */
_control.controller('ComfortCtrl',['$scope','$http','soapHP',
    '$localStorage','$rootScope','$ionicModal','queueHPc','$ionicListDelegate','networkHP',
    function($scope, $http, soapHP, $localStorage, $rootScope,
             $ionicModal, queueHPc, $ionicListDelegate,networkHP) {


        function IDGenerator()
        {
            var length = 8;
            var timestamp = + new Date;
            var ts = timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";
            for (var i = 0; i < length; ++i) {
                var min = 0;
                var max = parts.length - 1;
                var index = Math.floor(Math.random() * ( max - min + 1 )) + min;
                id += parts[index];
            }
            return id;
        }



            $scope.$storage = $localStorage;

        resetLastAction();

        $scope.$watch('$storage.lastConnectedServer', function() {
            resetLastAction();
        });



        $scope.dialogData = {
            "description" : "",
            "soapid" : "" ,
            "minValue" : "",
            "maxValue" : "",
            "stepSize" : "",
            "userInterface" : "",
            "uid": IDGenerator(),
            "lastValue": "--",
            "lastUpdate": "",
            "lastAction" : "new"};

        $ionicModal.fromTemplateUrl('templates/comfortlist_dialog.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        //$scope.openModal = function() {
        //    $scope.modal.show();
        //};
        //$scope.closeModal = function() {
        //    $scope.modal.hide();
        //};
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.dialogData = {
                "description" : "",
                "soapid" : "" ,
                "minValue" : "",
                "maxValue" : "",
                "stepSize" : "",
                "userInterface" : "",
                "uid": IDGenerator(),
                "lastValue": "--",
                "lastUpdate": "",
                "lastAction" : "new"};
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            $scope.dialogData = {
                "description" : "",
                "soapid" : "" ,
                "minValue" : "",
                "maxValue" : "",
                "stepSize" : "",
                "userInterface" : "",
                "uid": IDGenerator(),
                "lastValue": "--",
                "lastUpdate": "",
                "lastAction" : "new"};
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            $scope.dialogData = {
                "description" : "",
                "soapid" : "" ,
                "minValue" : "",
                "maxValue" : "",
                "stepSize" : "",
                "userInterface" : "",
                "uid": IDGenerator(),
                "lastValue": "--",
                "lastUpdate": "",
                "lastAction" : "new"};
            // Execute action
        });

        $scope.openDialogNew = function () {
            $scope.dialogData = {
                "description" : "",
                "soapid" : "" ,
                "minValue" : "",
                "maxValue" : "",
                "stepSize" : "",
                "userInterface" : "",
                "uid": IDGenerator(),
                "lastValue": "--",
                "lastUpdate": "",
                "lastAction" : "new"};
            $scope.modal.show();
        };

        $scope.closeModalSave = function () {
            var newItem = {};
            newItem.description = $scope.dialogData.description;
            newItem.soapid = $scope.dialogData.soapid;
            newItem.minValue = $scope.dialogData.minValue;
            newItem.maxValue = $scope.dialogData.maxValue;
            newItem.stepSize = $scope.dialogData.stepSize;
            newItem.userInterface = $scope.dialogData.userInterface;
            newItem.uid = $scope.dialogData.uid;
            newItem.lastValue = $scope.dialogData.lastValue;
            newItem.lastAction = $scope.dialogData.lastAction;
            if ( $scope.dialogData.lastAction == 'new') {
                $scope.$storage.comfortlist.push(newItem);
            }
            else if ( $scope.dialogData.lastAction == 'change') {
                var editIndex = $scope.$storage.comfortlist.indexOf($scope.tmpEditItem);
                $scope.$storage.comfortlist[editIndex] = newItem;
            }

            $ionicListDelegate.$getByHandle('comfort-list').closeOptionButtons();
            $scope.modal.hide();
            queueHPc.asyncTask(newItem);
        };

        $scope.closeModalCancel = function () {
            $ionicListDelegate.$getByHandle('comfort-list').closeOptionButtons();
            $scope.modal.hide();
        };

        $scope.onItemDelete = function(item) {
            $ionicListDelegate.$getByHandle('comfort-list').closeOptionButtons();
            $scope.$storage.comfortlist.splice($scope.$storage.comfortlist.indexOf(item), 1);
        };

        $scope.onItemEdit = function(item) {
            // Remember edit item to change it later
            $scope.tmpEditItem = item;
            $scope.dialogData.lastAction = 'change';
            $scope.dialogData.description = item.description;
            $scope.dialogData.soapid = item.soapid;
            $scope.dialogData.lastValue = item.lastValue;
            $scope.dialogData.minValue = item.minValue;
            $scope.dialogData.maxValue = item.maxValue;
            $scope.dialogData.stepSize = item.stepSize;
            $scope.dialogData.userInterface = item.userInterface;
            $scope.dialogData.uid = item.uid;
            $scope.modal.show();
        };

        $scope.doRefresh = function() {
            resetLastAction();
            $scope.$broadcast('scroll.refreshComplete');
        };

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.views.menuContent.controller === 'ComfortCtrl') {
                resetLastAction();
            }
        });

        // reload data if the view is resumed from background
        document.addEventListener("resume", function () {
            resetLastAction();
        }, false);


        function resetLastAction() {

            networkHP.checkConnection();

            $scope.$storage.comfortlist.forEach(function(entry, index) {
                queueHPc.asyncTask(entry);
            });
        }

        $scope.onReorder = function (fromIndex, toIndex) {

            var LengthOfList = $scope.$storage.statuslist.length;

            var moved = $scope.$storage.comfortlist.splice(fromIndex - LengthOfList, 1);
            $scope.$storage.comfortlist.splice(toIndex, 0, moved[0]);
        };

        $scope.goDetail = function (item) {
            // console.log(item);
        };


    }]);





