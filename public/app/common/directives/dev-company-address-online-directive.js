'use strict';
/* @ngInject */
var DnBCompanyAddressOnelineDirective = function (addressFactory) {
    return {
        restrict: 'E',
        scope: {
            company: '='
        },
        template: require('./dnb-company-address-oneline.html'),
        link: function (scope) {
            scope.$watch('company', function(newValue, oldValue){
                if (newValue && newValue !== oldValue) {
                    scope.oneLineAddress = addressFactory.getOneLineCompanyAddress(newValue);
                }
            });
            scope.oneLineAddress = addressFactory.getOneLineCompanyAddress(scope.company);
        }
    };
};

module.exports = DnBCompanyAddressOnelineDirective;

