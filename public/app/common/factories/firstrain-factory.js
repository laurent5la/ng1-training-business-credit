'use strict';

/* @ngInject */
var FirstrainFactory = function ($q, $http, endpoints, externalResources) {

    var self = this;
    self.authKey = null;

    var getAuthKey = function () {
        return $http.get(endpoints.social.firstRain.authToken, {cache: true})
           .then(function(result) {
               self.authKey = result.data.authKey;
           });
    };

    var checkAvailability = function(duns) {
        var url = externalResources.firstRain.baseUrl
            .concat(externalResources.firstRain.endpoints.availability)
            .replace(':duns', duns);

        return $http.get(url, {
                cache: true,
                headers: {
                    authKey: self.authKey,
                    frUserId: externalResources.firstRain.availabilityUser
                }
            }).then(function(result) {
                if (result && result.data && result.data.result) {
                    return result.data.result.entity[0].support;
                } else {
                    return null;
                }
            });
    };

    var buildURLbyType = function (type, duns) {
        return externalResources.firstRain.baseUrl
            .concat(externalResources.firstRain.iframes[type])
            .replace(':duns', duns)
            .replace(':authKey', self.authKey);
    };

    self.getURLbyType = function (type, duns) {
        return getAuthKey().then(function () {
            return checkAvailability(duns).then(function (available) {
                return available ? buildURLbyType(type, duns) : $q.reject();
            });
        });
    };

};

module.exports = FirstrainFactory;
