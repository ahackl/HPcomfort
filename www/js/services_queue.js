_service.factory('queueHPs',['$q','$timeout','soapHP','$localStorage','$filter','moment',
    function($q,$timeout,soapHP,$localStorage,$filter,moment){

    var $storage = $localStorage;
    var _fact ={};
    var queue = $q.when();
    var _asyncTask = function(value){
        queue = queue.then(
            function () {
                var deferred = $q.defer();

                var promise = soapHP.sendSOAP($storage, value.soapid);
                $storage.statuslist.forEach(function(oneItem,index) {
                    if (oneItem.soapid ===  value.soapid) {
                        $storage.statuslist[index].lastAction = 'read';
                    };
                });

                promise.then(
                    function(answer) {
                        //console.log(JSON.stringify(answer));
                        //console.log(JSON.stringify(soapHP.getValue(answer)));
                        var _intvalue = value;
                        _intvalue.lastValue = soapHP.getValue(answer);
                        _intvalue.lastAction = 'updated';
                        $storage.lastStatusUpdate = moment().format('DD.MM.YYYY HH:mm:ss');
                        $storage.statuslist.forEach(function(entry,index) {
                            if (entry.soapid ===  _intvalue.soapid) {
                                $storage.statuslist[index] = _intvalue;
                            };
                        });
                        deferred.resolve(_intvalue);
                    },
                    function(error) {
                        //console.log(JSON.stringify(error));
                        var _intvalue = value;
                        _intvalue.lastValue = '--';
                        _intvalue.lastAction = 'updated';
                        $storage.lastStatusUpdate = moment().format('DD.MM.YYYY HH:mm:ss');
                        $storage.statuslist.forEach(function(entry,index) {
                            if (entry.soapid ===  _intvalue.soapid) {
                                $storage.statuslist[index] = _intvalue;
                            };
                        });
                        deferred.resolve(_intvalue);
                    });

                return deferred.promise;
            }
        );
        return queue;
    };
    _fact.asyncTask = _asyncTask;
    return _fact;
}]);




_service.factory('queueHPc',['$q','$timeout','soapHP','$localStorage','$filter',
    function($q,$timeout,soapHP,$localStorage,$filter){

        var $storage = $localStorage;
        var _fact ={};
        var queue = $q.when();
        var _asyncTask = function(value){
            queue = queue.then(
                function () {
                    var deferred = $q.defer();

                    var promise = soapHP.sendSOAP($storage, value.soapid);
                    $storage.comfortlist.forEach(function(oneItem,index) {
                        if (oneItem.soapid ===  value.soapid) {
                            $storage.comfortlist[index].lastAction = 'read';
                        };
                    });

                    promise.then(
                        function(answer) {
                            // console.log(JSON.stringify(answer));
                            //console.log(JSON.stringify(soapHP.getValue(answer)));
                            var _intvalue = value;
                            _intvalue.lastValue = soapHP.getValue(answer);
                            _intvalue.lastAction = 'updated';
                            $storage.lastComfortUpdate = moment().format('DD.MM.YYYY HH:mm:ss');
                            $storage.comfortlist.forEach(function(entry,index) {
                                if (entry.soapid ===  _intvalue.soapid) {
                                    $storage.comfortlist[index] = _intvalue;
                                };
                            });
                            deferred.resolve(_intvalue);
                        },
                        function(error) {
                            // console.log(JSON.stringify(error));
                            var _intvalue = value;
                            _intvalue.lastValue = '--';
                            _intvalue.lastAction = 'updated';
                            $storage.lastComfortUpdate = moment().format('DD.MM.YYYY HH:mm:ss');
                            $storage.comfortlist.forEach(function(entry,index) {
                                if (entry.soapid ===  _intvalue.soapid) {
                                    $storage.comfortlist[index] = _intvalue;
                                };
                            });
                            deferred.resolve(_intvalue);
                        });

                    return deferred.promise;
                }
            );
            return queue;
        };
        _fact.asyncTask = _asyncTask;
        return _fact;
    }]);


