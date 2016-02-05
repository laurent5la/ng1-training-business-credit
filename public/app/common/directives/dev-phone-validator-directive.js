'use strict';

/* @ngInject */
var DnBPhoneValidatorDirective = function() {

    var validatePhone = require('./dnb-phone-validator');

    var formatExampleCA = 'e.g. (xxx) xxx-xxxx';
    var formatExampleUS = 'e.g. xxxxxxxxxx';

    return {
        require: 'ngModel',
        scope: {
            country : '=dnbPhoneValidator',
            formatExample : '=formatExample'
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.dnbPhoneValidator = function(modelValue, viewValue) {

                return validatePhone(viewValue,scope.country);
            };

            var stopWatchingCountry = scope.$watch('country', function() {
                ngModel.$validate();

                if (scope.formatExample){
                    if (scope.country === 'CA'){
                        scope.formatExample = formatExampleCA;
                    }else if (scope.country === 'US'){
                        scope.formatExample = formatExampleUS;
                    }else {
                        scope.formatExample = '';
                    }

                }
            });

            scope.$on('$destroy', stopWatchingCountry);
        }
    };
};

module.exports = DnBPhoneValidatorDirective;