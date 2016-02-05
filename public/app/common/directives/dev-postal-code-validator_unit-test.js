'use strict';


var chai = require('chai');
var expect = chai.expect;

var validatePostalCode = require('./dnb-postal-code-validator.js');

describe('Postal code validator', function(){

    it('should allow valid postal codes', function(){

        //CA
        expect(validatePostalCode('B0R1A0','CA')).to.be.true();
        expect(validatePostalCode('b0R1a0','CA')).to.be.true();
        expect(validatePostalCode('B0R 1A0','CA')).to.be.true();
        expect(validatePostalCode('b0c 1c0','CA')).to.be.true();
        expect(validatePostalCode('b0e 2w0','CA')).to.be.true();

        //US
        expect(validatePostalCode('78962','US')).to.be.true();
        expect(validatePostalCode('78701','US')).to.be.true();

        //Uk
        expect(validatePostalCode('W112BQ','UK')).to.be.true();
        expect(validatePostalCode('eh129bz','UK')).to.be.true();
        expect(validatePostalCode('EC1Y8SY','UK')).to.be.true();
        expect(validatePostalCode('E81WT','UK')).to.be.true();

        //BE and LU
        expect(validatePostalCode('2000','BE')).to.be.true();
        expect(validatePostalCode('2030','BE')).to.be.true();
        expect(validatePostalCode('1009','LU')).to.be.true();
        expect(validatePostalCode('1028','LU')).to.be.true();

        //NE
        expect(validatePostalCode('9446PA','NE')).to.be.true();
        expect(validatePostalCode('9442PP','NE')).to.be.true();


        // If the postal code or country is not provided, we treat it as valid
        expect(validatePostalCode(null,null)).to.be.true();
        expect(validatePostalCode(null,'US')).to.be.true();
        expect(validatePostalCode('78962',null)).to.be.true();

        // Providing an unsupported country is valid (we don't want it to block the user)
        expect(validatePostalCode('1234','AI')).to.be.true();
    });

    it('should not allow invalid postal codes', function(){

        //CA
        expect(validatePostalCode('BOC','CA')).to.be.false();
        expect(validatePostalCode('B0R  1A0','CA')).to.be.false();
        expect(validatePostalCode('B0R-1A0','CA')).to.be.false();

        //US
        expect(validatePostalCode('78962-1111','US')).to.be.false();
        expect(validatePostalCode('787011111','US')).to.be.false();
        expect(validatePostalCode('78962 1111','US')).to.be.false();

        //Uk
        expect(validatePostalCode('DH1 9JH','UK')).to.be.false();
        expect(validatePostalCode('EC1Y-8SY','UK')).to.be.false();
        expect(validatePostalCode('DL5','UK')).to.be.false();

        //BE and LU
        expect(validatePostalCode('BE341','BE')).to.be.false();
        expect(validatePostalCode('203','BE')).to.be.false();
        expect(validatePostalCode('L-1009','LU')).to.be.false();
        expect(validatePostalCode('L1028','LU')).to.be.false();

        //NE
        expect(validatePostalCode('9446 PA','NL')).to.be.false();
        expect(validatePostalCode('9442-PP','NL')).to.be.false();
    });
});