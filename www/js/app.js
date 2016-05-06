// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers_comfort.js
angular.module('starter', ['ionic' ,'starter.controllers', 'starter.services', 'starter.directive', 'ionic-toast', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform, $localStorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    var $storage = $localStorage.$default({
      username: 'username',
      password: 'password',
      server: 'server',
      server_wifi: 'server_wifi',
      oidComfort: '/1/2/4/3/58/0',
      startState: {name:'settings', state:'/app/settings'},
      allowedStates : [ {name:'comfort', state:'/app/comfortlist'},
                        {name:'status', state:'/app/statuslist'},
                        {name:'help', state:'/app/help'},
                        {name:'settings', state:'/app/settings'}],
      lastStatusUpdate: null,
      statuslist: []
    });

  });

})

.config(function($stateProvider, $urlRouterProvider, $localStorageProvider) {

  $localStorageProvider.setKeyPrefix('HPsettings');

  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
    //resolve:{ 'settingData' : function(settingHP){return settingHP.promise;} }
  })
  .state('app.help', {
    url: '/help',
    views: {
      'menuContent': {
        templateUrl: 'templates/help.html'
      }
    }
      })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  .state('app.comfortlist', {
    url: '/comfortlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/comfortlist.html',
        controller: 'ComfortCtrl'
      }
    }
  })
  .state('app.statuslist', {
    url: '/statuslist',
      views: {
        'menuContent': {
          templateUrl: 'templates/statuslist.html',
          controller: 'StatusCtrl'
          }
      }
  });
  // if none of the above states are matched, use this as the fallback

  var startState = $localStorageProvider.get('startState');
  var allowedStates = $localStorageProvider.get('allowedStates');

  var isInList = false;
  if (allowedStates != null) {
    allowedStates.forEach(function(entry) {
      if (startState.state === entry.state) {
        isInList = true;
      }
    });
  }
  if (isInList === false) {
    startState = {name:'settings', state:'/app/settings'};
    $localStorageProvider.set('startState', startState);
  }

  $urlRouterProvider.otherwise(startState.state);

});

var _directive = angular.module('starter.directive', []);

var _service = angular.module('starter.services', []);

var _control = angular.module('starter.controllers', ['starter.services']);
