'use strict';

// we ignore complaints about camel case as snake style  better reflects the meaning for phone number patterns
/*jshint camelcase: false */

var XXXX_XXX_XXXX = function (original) {
    return original.substring(0, 4)  + ' ' + original.substring(4, 7) + ' ' + original.substring(7);
};


var PXXXX_XXX_XXXX = function (original) {
    return '(' + original.substring(0, 4)  + ') ' + original.substring(4, 7) + ' ' + original.substring(7);
};


var XXX_XXXX_XXXX = function (original) {
    return original.substring(0, 3)  + ' ' + original.substring(3, 7) + ' ' + original.substring(7);
};


var PXXX_XXXX_XXXX = function (original) {
    return '(' + original.substring(0, 3)  + ') ' + original.substring(3, 7) + ' ' + original.substring(7);
};


var XXXXX_XXXXXX = function (original) {
    return original.substring(0, 5)  + ' ' + original.substring(5);
};


var PXXXXX_XXXXXX = function (original) {
    return '(' + original.substring(0, 5)  + ') ' + original.substring(5);
};

var formatUKPhone = function(original) {
    if (original && original.length === 11) {
        if (original.indexOf('01') === 0) {
            if (original.match(/^01\d1/)) {
                return PXXXX_XXX_XXXX(original);
            }
            if (original.match(/^011\d/)) {
                return PXXXX_XXX_XXXX(original);
            }
            return PXXXXX_XXXXXX(original);
        }
        if (original.indexOf('02') === 0) {
            return PXXX_XXXX_XXXX(original);
        }
        if (original.indexOf('03') === 0) {
            return XXXX_XXX_XXXX(original);
        }
        if (original.indexOf('05') === 0) {
            return XXX_XXXX_XXXX(original);
        }
        if (original.indexOf('07') === 0) {
            if (original.indexOf('070') === 0) {
                return XXX_XXXX_XXXX(original);
            }
            if (original.indexOf('07624') === 0) {
                return XXXXX_XXXXXX(original);
            }
            if (original.indexOf('076') === 0) {
                return XXX_XXXX_XXXX(original);
            }

            return XXXXX_XXXXXX(original);
        }
        if (original.indexOf('08') === 0) {
            return XXXX_XXX_XXXX(original);
        }
        if (original.indexOf('09') === 0) {
            return XXXX_XXX_XXXX(original);
        }
    }
    return original;
};

var reverseString = function(str) {
    return str.split('').reverse().join('');
};

var convertPhoneNumber = function(country, phone) {

    if (country && phone) {
        // remove any exiting formatting - that we get from the PCM data
        phone = phone.replace(/[+ ()-]/g, '');
        switch(country) {
            case 'US':
            case 'CA': //CIR-3005 & CIR-4360 we shouldn't display + for phone numbers
                if (phone && phone.length === 10) {
                    return ('1 (' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6));
                } else if (phone && phone.length === 11) {
                    return (phone.substring(0, 1) + ' (' + phone.substring(1, 4) + ') ' + phone.substring(4, 7) + '-' + phone.substring(7));
                }
                break;
            case 'FR':
                return reverseString(reverseString(phone).match(/.{1,2}/g).join(' '));
            case 'GB':
                return formatUKPhone(phone);
        }
    }

    return phone;
};

module.exports = convertPhoneNumber;