'use strict';

/* @ngInject */
var DnbJoinByFilter = function () {
    return function(input, delimiter) {
        if(!input || input === null || !Array.isArray(input)) {
            return input;
        }
        input =  input.filter(function(element){
            return element;
        });

        return (input || []).join(delimiter || ',');
    };
};

module.exports = DnbJoinByFilter;


