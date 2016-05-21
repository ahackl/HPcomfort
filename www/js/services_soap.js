/**
 * Created by alexander on 07.02.16.
 */
_service.factory('soapHP', ['$http',
    function ($http) {
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


        function sendSOAP($storage, $oid) {

            var server = getServer($storage);

            var authdata = btoa($storage.username + ':' + $storage.password);

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
                url: 'http://'+ server +'/ws',
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': 'Basic ' + authdata
                },
                data: payload
            };
            // console.log(JSON.stringify(req));
            return $http(req);
        }

        function sendSOAPwithValue($storage, $oid, $value){

            var server = getServer($storage);

            var authenticationData = btoa($storage.username + ':' + $storage.password);

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
                url: 'http://'+ server +'/ws',
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': 'Basic ' + authenticationData
                },
                data: payloadSave
            };
            return $http(req);
        }

        function getValue(answer) {
            try {
                // console.log(JSON.stringify(answer.data));
                var Xdom = parseXml(answer.data);
                return Xdom.getElementsByTagName('value')[0].childNodes[0].nodeValue;
            }
            catch (e) {
                return '--';
            }
        }

        function getServer($storage) {
            // console.log('lastConnectedServer: ' + $storage.lastConnectedServer);
            // console.log('serverStates: ' + $storage.serverStates.name);
            var server = $storage.server;
              if ($storage.lastConnectedServer === 'intern' ) {
                    server = $storage.server_wifi;
                } else {
                    server = $storage.server;
                }
            return server;
        }



        return service;
    }]);

