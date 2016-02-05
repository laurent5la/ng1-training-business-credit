/* angular-load.js / v0.2.0 / (c) 2014 Uri Shaked / MIT Licence */
/* src:  https://github.com/urish/angular-load/blob/master/angular-load.js*/

'use strict';

/* @ngInject */
var DynamicLoad = function ($document, $q, $timeout) {

    return {
        /**
         * Dynamically loads the given script
         * @param src The url of the script to load dynamically
         * @returns {*} Promise that will be resolved once the script has been loaded.
         */
        loadScript : function (src) {
            var deferred = $q.defer();
            var script = $document[0].createElement('script');
            script.onload = script.onreadystatechange = function (e) {
                $timeout(function () {
                    deferred.resolve(e);
                });
            };
            script.onerror = function (e) {
                $timeout(function () {
                    deferred.reject(e);
                });
            };
            script.src = src;
            $document[0].body.appendChild(script);
            return deferred.promise;
        },

        /**
         * Dynamically loads the given CSS file
         * @param href {string} The url of the CSS to load dynamically
         * @returns {*} Promise that will be resolved once the CSS file has been loaded.
         */
        loadCSS : function (href) {
            var deferred = $q.defer();
            var style = $document[0].createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = href;
            style.onload = style.onreadystatechange = function (e) {
                $timeout(function () {
                    deferred.resolve(e);
                });
            };
            style.onerror = function (e) {
                $timeout(function () {
                    deferred.reject(e);
                });
            };
            $document[0].head.appendChild(style);
            return deferred.promise;
        }
    };
};

module.exports = DynamicLoad;
