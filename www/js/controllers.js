angular.module('starter.controllers', [])

.controller('AppCtrl',['$scope', '$http','ionicToast',
  function($scope, $http, ionicToast) {

      $scope.settingData = {
          majorReleaseNo : 1,
          minorReleaseNo : 0,
          patchLevelNo : 0
      };

    document.addEventListener("resume", function() {
      getTempValue();
    }, false);

    var localDb = new PouchDB('WPDB');

    // read setting from database
    localDb.get('settings').then(function (settingDocument) {
      // console.log('Read Settings from database');
      $scope.loginData = settingDocument;
      getTempValue();

    }).catch(function (err) {
      if (err.status === 404) {
        //console.log('Setting document not available -> create it');

        var settings = {
          _id: 'settings',
          _rev: '',
          username: 'username',
          password: 'password',
          server: 'server',
          oidComfort: '/1/2/4/3/58/0'
        };

        localDb.put(settings).then(function (result) {
          //console.log('Setting document created: ' + JSON.stringify(result));
          settings._rev = result.rev;
          $scope.loginData = settings;
          getTempValue();

        }).catch(function (err) {
          // console.error('Setting document not created: ' + JSON.stringify(err));
        });
      } else {
        // console.error(err.toString());
      }

    });

    $scope.$parent.$on('$ionicNavView.enter', function() {
      if ( $scope.hasOwnProperty('loginData') ) {
        getTempValue();
      }
    });

    $scope.wp = {
      temp: 0.0,
      id: 0
    };

  $scope.ngButtonMarked = [];
  $scope.ngButtonText = [];
  for (var i = 0; i <= 12; i++) {
    $scope.ngButtonMarked.push(false);
    $scope.ngButtonText.push(3.0 - 0.5 * i);
  }

  function setTempValue(newTempValue) {

    var authenticationData = btoa($scope.loginData.username + ':' + $scope.loginData.password);

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
        payloadSave +='<oid>' + $scope.loginData.oidComfort + '</oid>';
        payloadSave +='<prop/>';
        payloadSave +='</ref>';
        payloadSave +='<dp>';
        payloadSave +='<index>0</index>';
        payloadSave +='<name/>';
        payloadSave +='<prop/>';
        payloadSave +='<desc/>';
        payloadSave +='<value>' + newTempValue + '</value>';
        payloadSave +='<unit/>';
        payloadSave +='<timestamp>0</timestamp>';
        payloadSave +='</dp>';
        payloadSave +='</ns:writeDpRequest>';
        payloadSave +='</SOAP-ENV:Body>';
        payloadSave +='</SOAP-ENV:Envelope>';

    var req = {
      method: 'POST',
      url: 'http://'+ $scope.loginData.server +'/ws',
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + authenticationData
      },
      data: payloadSave
    };

    $scope.LogText = '';

    var promiseSave = $http(req);

    promiseSave.then(
        function(answer) {
          $scope.LogText = answer.data;
          getTempValue();
        },
        function(error) {
          $scope.LogText = error.data;
        });

  }

  function getTempValue() {

    var authdata = btoa($scope.loginData.username + ':' + $scope.loginData.password);

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
        payload += '<oid>' + $scope.loginData.oidComfort + '</oid>';
        payload += '<prop/>';
        payload += '</ref>';
        payload += '<startIndex>0</startIndex>';
        payload += '<count>-1</count>';
        payload += '</ns:getDpRequest>';
        payload += '</SOAP-ENV:Body>';
        payload += '</SOAP-ENV:Envelope>';

    var req = {
      method: 'POST',
      url: 'http://'+ $scope.loginData.server +'/ws',
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + authdata
      },
      data: payload
    };

    $scope.LogText = '';

    var promise = $http(req);

    promise.then(
        function(answer) {
          var Xdom = parseXml(answer.data);
          $scope.wp.temp = Xdom.getElementsByTagName('value')[0].childNodes[0].nodeValue;
          $scope.ngButtonMarked[$scope.wp.id] = false;
          $scope.wp.id = 6.0 - 2.0 * $scope.wp.temp;
          $scope.ngButtonMarked[$scope.wp.id] = true;

        },
        function(error) {
          $scope.ngButtonMarked[$scope.wp.id] = false;
          $scope.LogText = error.data;
        });


  }

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


  $scope.ngButtonClick = function(buttonIndex) {
    var newTempValue = 3.0 - 0.5 * buttonIndex;
    setTempValue(newTempValue);
  };


  // Save Settings
  $scope.saveSettings = function() {

    // save the new setting to the database
    localDb.put($scope.loginData).then(function (result) {
      // console.log('Settings saved: ' + JSON.stringify(result));
      // write the new revision number into the global setting object
      $scope.loginData._rev = result.rev;
      getTempValue();
      ionicToast.show('Settings saved', 'bottom', false, 2000);

    }).catch(function (error) {
      // console.error('Settings not saved: ' + JSON.stringify(error));
    });


  };
}]);

