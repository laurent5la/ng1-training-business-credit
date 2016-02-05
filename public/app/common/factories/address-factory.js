/**
 * @author Sohrab Zabetian
 * @project cirrus-ui
 *
 * @description generates addresses for user and company
 *
 * @copyright D&B
 *
 */
'use strict';

/* @ngInject */
var AddressFactory = function ($log, $filter, utils, locationFactory) {

    function valueOrDash (value) {
        return value || '-';
    }

    function getUserAddress(user) {
        return {
            address: user.city + ', ' + $filter('translate')('province-' + user.stateProvince) + ', ' + user.postalCode,
            country: $filter('translate')('country-' + user.country)
        };
    }

    function getCompanyAddress(company) {
        var companyAddress = {
            address: '',
            country: ''
        };
        if (angular.isDefined(company) && company !== null) {
            var address = [company.addressTown ? utils.capitalize(company.addressTown) : ''];

            if (company.addressTerritory) {
                address.push(company.addressTerritory);
            }

            if (company.addressPostal) {
                address.push(company.addressPostal);
            }

            companyAddress = {
                city: address.join(', '),
                country: $filter('translate')('country-' + company.addressCountry)
            };

            if (angular.isDefined(company.addressStreet)) {
                companyAddress.address = utils.capitalize(company.addressStreet);
            }
        }


        return companyAddress;
    }

    function extractCompanyAddress(subjectDetail) {
        return {
            companyAddress: angular.isDefined(subjectDetail.PrimaryAddress.StreetAddressLine) ? valueOrDash(subjectDetail.PrimaryAddress.StreetAddressLine[0].LineText) : '-', //throws an exception becasue the service does not return the address.
            companyCity: valueOrDash(subjectDetail.PrimaryAddress.PrimaryTownName),
            companyState: valueOrDash(subjectDetail.PrimaryAddress.TerritoryName),
            companyCountry: subjectDetail.PrimaryAddress.CountryISOAlpha2Code
        };
    }

    function getOneLineCompanyAddress(company) {
        var addressParts = {
            address: company.addressStreet,
            address2: company.addressStreet2,
            city: company.addressTown,
            postal: company.addressPostal,
            stateprovince: company.addressTerritory,
            country: locationFactory.getCountryNameByCode(company.addressCountry)
        };
        var concatPatterns = {
            'US': [addressParts.address, addressParts.address2, addressParts.city, addressParts.stateprovince, addressParts.postal, addressParts.country],
            'CA': [addressParts.address, addressParts.address2, addressParts.city, addressParts.stateprovince, addressParts.postal, addressParts.country]
        };
        var localizedPattern = concatPatterns[company.addressCountry] || concatPatterns.US;
        return $filter('dnbJoinBy')(localizedPattern, ', ');
    }

    return {
        getUserAddress: getUserAddress,
        getCompanyAddress: getCompanyAddress,
        extractCompanyAddress: extractCompanyAddress,
        getOneLineCompanyAddress: getOneLineCompanyAddress,
    };


};

module.exports = AddressFactory;
