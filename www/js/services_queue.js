_service.factory('queueHP',['$q','$timeout','soapHP','$localStorage',
    function($q,$timeout,soapHP,$localStorage){

    var $storage = $localStorage;
    var _fact ={};
    var queue = $q.when();
    var _asyncTask = function(value){
        queue = queue.then(
            function () {
                var deferred = $q.defer();

                var promise = soapHP.sendSOAP($storage, value.soapid);
                // console.log(JSON.stringify(value.soapid));

                promise.then(
                    function(answer) {
                        //console.log(JSON.stringify(answer));
                        //console.log(JSON.stringify(soapHP.getValue(answer)));
                        var _intvalue = value;
                        _intvalue.lastValue = soapHP.getValue(answer);
                        _intvalue.lastAction = 'updated';
                        deferred.resolve(_intvalue);
                    },
                    function(error) {
                        //console.log(JSON.stringify(error));
                        var _intvalue = value;
                        _intvalue.lastValue = '--';
                        _intvalue.lastAction = 'updated';
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