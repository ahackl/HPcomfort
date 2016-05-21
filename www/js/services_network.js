_service.factory('networkHP',['$q','$cordovaNetwork','$localStorage',
    function($q, $cordovaNetwork, $localStorage){
        'use strict';

        var networkState = 'unknown';
        var wifiSSID = '';
        var checkConnectionInterval = undefined;

        checkConnection();

        var service = {
            getSSID: getSSID,
            getNetworkState: getNetworkState,
            stop: stop,
            start: start,
            checkConnection: checkConnection
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

       function checkConnection() {
            try {
                networkState = $cordovaNetwork.getNetwork();
                if (networkState == 'wifi') {
                    WifiWizard.getCurrentSSID(
                        function(s) {
                            wifiSSID= s.replace(/"/g, '');
                            if ($localStorage.serverStates.state === 'useAutomatic') {
                                if (networkState == 'wifi' && wifiSSID == $localStorage.wifi_ssid) {
                                    $localStorage.lastConnectedServer = 'intern';
                                } else {
                                    $localStorage.lastConnectedServer = 'extern';
                                }
                            }else if($localStorage.serverStates.state === 'useIntern') {
                                $localStorage.lastConnectedServer = 'intern';
                            }else if ($localStorage.serverStates.state === 'useExtern') {
                                $localStorage.lastConnectedServer = 'extern';
                            }
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