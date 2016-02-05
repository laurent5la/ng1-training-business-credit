'use strict';

/* @ngInject */
var DnBPostalCodeDirective = function() {

    var validatePostalCode = require('./dnb-postal-code-validator');

    return {
        require: 'ngModel',
        scope:{
            country: '=',
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.dnbPostalCodeValidator = function(modelValue, viewValue) {
                return validatePostalCode(viewValue, scope.country);
            };

            scope.$watch('country', function() {
                ngModel.$validate();
            });

        }
    };
};

module.exports = DnBPostalCodeDirective;
