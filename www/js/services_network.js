_service.factory('networkHP',['$q','$interval','$cordovaNetwork','$localStorage',
    function($q, $interval,$cordovaNetwork,$localStorage){
        'use strict';

        var networkState = 'unknown';
        var wifiSSID = '';
        var checkConnectionInterval = undefined;
        var timerInterval = 2000;


        checkConnectionInterval = $interval(checkConnection, timerInterval);

        var service = {
            getSSID: getSSID,
            useInternalServer: useInternalServer,
            getNetworkState: getNetworkState,
            stop: stop,
            start: start
        };

        function getSSID() {
            return(wifiSSID);
        }

        function getNetworkState() {
            return(networkState);
        }

        function stop() {
            if (angular.isDefined(checkConnectionInterval)) {
                $interval.cancel(checkConnectionInterval);
                checkConnectionInterval = undefined;
            }
        }

        function start() {
            if (angular.isUndefined(checkConnectionInterval)) {
                checkConnectionInterval = $interval(checkConnection, timerInterval);
            }
        }

        function useInternalServer() {
            if (networkState == 'wifi' && wifiSSID == $localStorage.wifi_ssid) {
                return(true);
            } else {
                return(false);
            }
        }

        function checkConnection() {
            try {
                networkState = $cordovaNetwork.getNetwork();
                if (networkState == 'wifi') {
                    WifiWizard.getCurrentSSID(
                        function(s) {
                            wifiSSID= s.replace(/"/g, '');
                        }, function(e){
                            wifiSSID = '';
                        });
                } else {
                    wifiSSID = '';
                }
            }
            catch(err) {
                networkState = 'unknown';
                wifiSSID = '';
            }
        }

        return service;

    }]);