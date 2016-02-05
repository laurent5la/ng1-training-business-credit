/**
 * @author Sohrab Zabetian
 * @project cirrus-ui
 *
 * @description Common utility methods
 *
 * @copyright D&B
 *
 */
'use strict';

/* @ngInject */
var Utils = function () {


    var service = {

        /**
         * Removes dashes if any
         * @param value
         * @returns transformed value
         */
        removeDashes: function (value) {
            return value.replace(/-/g, '');
        },

        /**
         * Capitalizes first character of a word
         * @param text
         * @returns capitalized word
         */
        capitalize: function (text) {

            return text ? text.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';

        }

    };

    return service;
};

module.exports = Utils;
