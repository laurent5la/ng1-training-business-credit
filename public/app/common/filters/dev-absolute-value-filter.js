'use strict';

/* @ngInject */
var DnbAbsoluteValue = function () {
    return function(input) {
        if (!input) {
            return 0;
        }
        return Math.abs(input);
    };
};

module.exports = DnbAbsoluteValue;
