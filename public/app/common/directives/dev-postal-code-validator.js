'use strict';

function validatePostalCode (postalCode, country){
    if(!country || !postalCode){
        //can't validate if we don't have a country, use required to check for blank values
        return true;
    }else{
        if(country === 'US'){
            return /^[\d]{5}$/.test(postalCode);
        }else if(country === 'CA'){
            return /^[A-Za-z0-9]{3}\s?[A-Za-z0-9]{3}$/.test(postalCode);
        }else if(country === 'UK'){
            return /^[A-Za-z0-9]{5,8}$/.test(postalCode);
        }else if(country === 'BE' || country === 'LU'){
            return /^[\d]{4}$/.test(postalCode);
        }else if(country === 'NL'){
            return /^[A-Za-z0-9]{6}$/.test(postalCode);
        }else{
            return true;
        }
    }
}

module.exports = validatePostalCode;