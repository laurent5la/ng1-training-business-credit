'use strict';

/* @ngInject */
var DnbFormatDuns = function () {
    return function(originalDuns) {
        if (originalDuns && originalDuns.length === 9) {
            return originalDuns.substring(0, 2)  + '-' + originalDuns.substring(2, 5) + '-' + originalDuns.substring(5);
        }
        return originalDuns;
    };
};

module.exports = DnbFormatDuns;
