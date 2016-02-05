/**
 * @author Sohrab Zabetian
 * @project cirrus-ui
 *
 * @description Filter to format the phone number
 *
 * @copyright D&B
 *
 */

'use strict';

/* @ngInject */
var PhoneNumberFilter = function () {

    var phoneFormatter = require('../factories/phone-formatter');

    return function(phoneNumber, country) {

        return phoneFormatter(country, phoneNumber);

    };

};

module.exports = PhoneNumberFilter;
