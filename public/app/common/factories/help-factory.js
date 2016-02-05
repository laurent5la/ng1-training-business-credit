'use strict';

/* @ngInject */
var HelpFactory = function ($http, $q, $filter, $sessionStorage, $log, localeFactory, endpoints, helppoints) {

    var termPromises = {};

    var getLocale = function() {
        var lang = localeFactory.currentLocale();
        return lang.label;
        // var locale = lang.label.replace('_', '-');
        // return locale;
    };
    var createLink = function(helppoint) {
        var locale = getLocale();
        if (helppoints[locale]) {
            return helppoints[locale][helppoint];
        } else {
            return '';
        }
    };
    return {
        links: {
            main: function() {
                return createLink('main');
            },
            alerts: function() {
                return createLink('alerts');
            }
        },
        lookupTerm: function(term) {
            var promise = termPromises[term];
            if (!promise) {
                var deferred = $q.defer();
                $http.get(endpoints.reference.terms.replace(':term', term)).then(function(response) {
                    if (response.status === 200) {
                        deferred.resolve(response.data);
                    } else {
                        $log.error(response);
                        deferred.reject();
                    }
                }, function (response) {
                    $log.error(response);
                    deferred.reject();
                });
                promise = deferred.promise;
                termPromises[term] = promise;
            }
            return promise;
        }
    };
};

module.exports = HelpFactory;
