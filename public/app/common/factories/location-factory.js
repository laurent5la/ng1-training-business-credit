'use strict';

/* @ngInject */
var LocationFactory = function ($log, $http, $q, $filter, endpoints) {

    var self = this;

    // An array gives more flexibility than an object in ng-repeat and ui-typeahead
    // convert {US: 'United States'} into [{code: 'US', name: 'United States'}]
    function transformData (countriesHash) {
            var countriesArray = [];
            angular.forEach(countriesHash, function(name, code) {
                this.push({code: code, name: name});
            }, countriesArray);
            return countriesArray;
        }

    this.countries = [];
    this.isValidCountryCode = function (code) {
            return $filter('filter')(self.countries, {code: code}, true).length;
        };

    this.getNameByCode = function (array, code) {
            var obj = $filter('filter')(array, {code: code}, true);
            if(obj && obj[0] && obj[0].name){
                return obj[0].name;
            }else{
                return '';
            }
        };

    this.getCountryNameByCode = function (code) {
            return this.countryMap[code] || code;
        };

    this.getCodeByName = function (array, name) {
            var obj = $filter('filter')(array, {name: name}, true);
            if(obj && obj[0] && obj[0].code){
                return obj[0].code;
            }else{
                return '';
            }
        };

    this.getCountries = function(){
            var deferred = $q.defer();
            // endpoint = endpoints.reference.countries;
            // $http.get(endpoint, {cache: true}).success(function(data){
            //     self.countries = transformData(data);
            //     deferred.resolve(data);
            // }).error(function(error){
            //     $log.error(error);
            // });
            self.countries = transformData(require('./countries'));
            deferred.resolve(self.countries);
            return deferred.promise;
        };

    this.getTerritories = function(countryCode){
            var deferred = $q.defer(),
                endpoint = endpoints.reference.territories.replace(':countryCode', countryCode);
            $http.get(endpoint, {cache: true}).success(function(data){
                self.territoryMap = data;
                data = transformData(data);
                deferred.resolve(data);
            }).error(function(error){
                $log.error(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

    this.countryMap = require('./countries');

};

module.exports = LocationFactory;
