/**
 * Created by alexander on 30.01.16.
 */
var _service = angular.module('starter.services', []);

_service.factory('soapHP', ['$http', 'settingHP',
    function ($http, settingHP) {
        'use strict';

        var service = {
            sendSOAP: sendSOAP,
            sendSOAPwithValue: sendSOAPwithValue,
            parseXml: parseXml,
            getValue: getValue
        };

        function parseXml(xml) {
            var dom = null;
            if (window.DOMParser) {
                try {
                    dom = (new DOMParser()).parseFromString(xml, "text/xml");
                }
                catch (e) { dom = null; }
            }
            else if (window.ActiveXObject) {
                try {
                    dom = new ActiveXObject('Microsoft.XMLDOM');
                    dom.async = false;
                    if (!dom.loadXML(xml)) // parse error ..
                        window.alert(dom.parseError.reason);
                }
                catch (e) { dom = null; }
            }
            else
                alert("cannot parse xml string!");
            return dom;
        }


        function sendSOAP($loginData, $oid) {

            var authdata = btoa($loginData.username + ':' + $loginData.password);

            var payload = '';
            payload += '<?xml version="1.0" encoding="UTF-8"?>';
            payload += '<SOAP-ENV:Envelope';
            payload += ' xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"';
            payload += ' xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"';
            payload += ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
            payload += ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"';
            payload += ' xmlns:ns="http://ws01.lom.ch/soap/">';
            payload += '<SOAP-ENV:Body>';
            payload += '<ns:getDpRequest>';
            payload += '<ref>';
            payload += '<oid>' + $oid + '</oid>';
            payload += '<prop/>';
            payload += '</ref>';
            payload += '<startIndex>0</startIndex>';
            payload += '<count>-1</count>';
            payload += '</ns:getDpRequest>';
            payload += '</SOAP-ENV:Body>';
            payload += '</SOAP-ENV:Envelope>';

            var req = {
                method: 'POST',
                url: 'http://'+ $loginData.server +'/ws',
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': 'Basic ' + authdata
                },
                data: payload
            };

           return $http(req);
        }

        function sendSOAPwithValue($loginData, $oid, $value){

            var authenticationData = btoa($loginData.username + ':' + $loginData.password);

            var payloadSave = '';
            payloadSave +='<?xml version="1.0" encoding="UTF-8"?>';
            payloadSave += '<SOAP-ENV:Envelope';
            payloadSave += ' xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"';
            payloadSave += ' xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"';
            payloadSave += ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
            payloadSave += ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"';
            payloadSave += ' xmlns:ns="http://ws01.lom.ch/soap/">';
            payloadSave +='<SOAP-ENV:Body>';
            payloadSave +='<ns:writeDpRequest>';
            payloadSave +='<ref>';
            payloadSave +='<oid>' + $oid + '</oid>';
            payloadSave +='<prop/>';
            payloadSave +='</ref>';
            payloadSave +='<dp>';
            payloadSave +='<index>0</index>';
            payloadSave +='<name/>';
            payloadSave +='<prop/>';
            payloadSave +='<desc/>';
            payloadSave +='<value>' + $value + '</value>';
            payloadSave +='<unit/>';
            payloadSave +='<timestamp>0</timestamp>';
            payloadSave +='</dp>';
            payloadSave +='</ns:writeDpRequest>';
            payloadSave +='</SOAP-ENV:Body>';
            payloadSave +='</SOAP-ENV:Envelope>';

            var req = {
                method: 'POST',
                url: 'http://'+ $loginData.server +'/ws',
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': 'Basic ' + authenticationData
                },
                data: payloadSave
            };

            return $http(req);


        }

        function getValue(answer) {
            var Xdom = parseXml(answer.data);
            return Xdom.getElementsByTagName('value')[0].childNodes[0].nodeValue;
        }

        return service;
    }]);

_service.service('settingHP', function() {

    var SettingsDB = {
        _id: 'settings',
        _rev: '',
        username: 'username',
        password: 'password',
        server: 'server',
        oidComfort: '/1/2/4/3/58/0'
    };

    var localDb = new PouchDB('WPDB');

    var promise = localDb.get('settings');
    promise.then(
        function(response){
            //console.log(JSON.stringify(response));
            SettingsDB = response;
        },
        function(error) {
            //console.log(JSON.stringify(error));
        }
    );

    getSettings = function () {
        return SettingsDB;
    };

    setSettings =  function (newSettings) {
        SettingsDB = newSettings;
        var promiseSave = localDb.put(SettingsDB);
        promiseSave.then(
            function (response) {
                //console.log(JSON.stringify(response));
                SettingsDB._rev = response.rev;
            },
            function (error) {
                //console.log(JSON.stringify(error));
            }
        );
        return promiseSave;
    };
    return {
        promise:promise,
        getSettings: getSettings,
        setSettings: setSettings
    };
});
