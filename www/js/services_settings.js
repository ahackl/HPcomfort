/**
 * Created by alexander on 04.02.16.
 */

_service.service('settingsHP', function() {

    var SettingsDB = {
        _id: 'settings',
        _rev: '',
        username: 'username',
        password: 'password',
        server: 'server',
        oidComfort: '/1/2/4/3/58/0',
        statuslist: []
    };

    var localDb = new PouchDB('WPDB');

    var promise = localDb.get('settings');
    promise.then(
        function(response){
            //console.log(JSON.stringify(response));
            SettingsDB = response;
            if ( SettingsDB._id == undefined ) {SettingsDB._id  = '_id' }
            if ( SettingsDB._rev == undefined ) {SettingsDB._rev  = '' }
            if ( SettingsDB.username == undefined ) {SettingsDB.username  = 'username' }
            if ( SettingsDB.password == undefined ) {SettingsDB.password  = 'password' }
            if ( SettingsDB.server == undefined ) {SettingsDB.server  = 'server' }
            if ( SettingsDB.oidComfort == undefined ) {SettingsDB.oidComfort  = '/1/2/4/3/58/0' }
            if ( SettingsDB.statuslist == undefined ) {SettingsDB.statuslist  = [] }
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

    getRevision = function() {
        return SettingsDB._rev;
    };

    getOidComfort = function() {
        return SettingsDB.oidComfort;
    };

    return {
        promise:promise,
        getSettings: getSettings,
        setSettings: setSettings,
        getRevision: getRevision,
        getOidComfort: getOidComfort
    };
});
