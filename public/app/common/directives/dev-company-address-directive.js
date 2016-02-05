'use strict';

/* @ngInject */
var DnBCompanyAddressDirective = function () {
    return {
        restrict: 'E',
        scope: {
            address:'='
        },
        template: require('./dnb-company-address.html'),
        link: function (scope) {

            scope.$watch('address', function() {
                scope.streetParts = [];
                if (scope.address.address1) {
                    scope.streetParts.push(scope.address.address1);
                }
                if (scope.address.address2) {
                    scope.streetParts.push(scope.address.address2);
                }
                scope.cityStateParts = [];
                if (scope.address.city) {
                    scope.cityStateParts.push(scope.address.city);
                }
                if (scope.address.stateCode) {
                    scope.cityStateParts.push(scope.address.stateCode);
                }
                if (scope.address.postalCode) {
                    scope.cityStateParts.push(scope.address.postalCode);
                }
            });

        }
    };
};

module.exports = DnBCompanyAddressDirective;

