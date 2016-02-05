'use strict';

var PHONE_REGEXP_CA = /^[\d+\-\(\)]+$/;
var PHONE_REGEXP_US = /^[\d]+$/;

var removeAllNonDigits = function(phone) {

    var ONLY_DIGITS_REGEX = /\D/g;

    var onlyDigits = '';

    if (phone) {
        onlyDigits = phone.replace(ONLY_DIGITS_REGEX, '');
    }

    return onlyDigits;
};

var validatePhone = function(phoneToTest, country){

    // We set it to valid if the phoneToTest or country are null
    var valid = true;

    if (phoneToTest && country) {

        if (country === 'CA'){

            // Check if the phone number only contains numbers, +, -, ( and )
            valid = PHONE_REGEXP_CA.test(phoneToTest);

            // Check if we have 10 digits (after removing the other chars)
            if (valid){
                var phoneDigitsOnly = removeAllNonDigits(phoneToTest);

                if (phoneDigitsOnly.length !== 10) {
                    valid = false;
                }
            }
        } else if(country === 'US'){

            // Currently the US phone validation is a placeholder.
            // The UI only allows you to pick Canada as a country currently.
            // This is added to show that there is a different validation when you switch the country to US.
            // This is NOT the actual US phone validation, only a Proof of Concept.
            valid = PHONE_REGEXP_US.test(phoneToTest);
        }
    }

    return valid;
};


module.exports = validatePhone;