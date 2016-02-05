/**
 * Created by valluris on 5/23/15.
 */

'use strict';

/* @ngInject */
var DnbStorageFactory =  function() {

    var _sessionStorage = {};
    var _localStorage = {};


    var init = function() {
        try{
            if (!angular.isUndefined(typeof window.sessionStorage)){
                _sessionStorage = window.sessionStorage;
            }
        }catch(e){}
        try{
            if (!angular.isUndefined(typeof window.localStorage)){
                _localStorage = window.localStorage;
            }
        }catch(e){}
    };


    var addToSession = function(key, value){
        _sessionStorage[key] = angular.toJson(value);
    };

    var getFromSession = function(key){
        return key in _sessionStorage && _sessionStorage[key] ? angular.fromJson(_sessionStorage[key]) : null;
    };

    var removeFromSession = function(key){
        return _sessionStorage[key] !== 'undefined' && delete _sessionStorage[key];
    };

    var clearSessionStorage = function(){
        return _sessionStorage.clear();
    };

    var addToLocal = function(key, value){
        _localStorage[key] = angular.toJson(value);
    };

    var getFromLocal = function(key){
        return key in _localStorage && _localStorage[key] ? angular.fromJson(_localStorage[key]) : null;
    };

    var removeFromLocal = function(key){
        return _localStorage[key] !== 'undefined' && delete _localStorage[key];
    };

    var clearLocalStorage = function(){
        return _localStorage.clear();
    };

    init();

    return {
        sessionSet: addToSession,
        sessionGet: getFromSession,
        sessionRemove: removeFromSession,
        localSet: addToLocal,
        localGet: getFromLocal,
        localRemove: removeFromLocal,
        clearLocalStorage: clearLocalStorage,
        clearSessionStorage: clearSessionStorage
    };

};

module.exports = DnbStorageFactory;
