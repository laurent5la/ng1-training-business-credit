'use strict';


var chai = require('chai');
var expect = chai.expect;

var validatePhone = require('./dnb-phone-validator.js');

describe('Phone validator', function(){

    it('should allow valid phone numbers', function(){

        // CA (allows numbers, +, -, ( and ) should be exact 10 digits
        expect(validatePhone('604-365-7894','CA')).to.be.true();
        expect(validatePhone('+(999)-123-1782','CA')).to.be.true();

        // US (only allows digits to see that it's working)
        expect(validatePhone('6043657894','US')).to.be.true();
        expect(validatePhone('9991231782','US')).to.be.true();

        // If the phone number or country is not provided, we treat it as valid
        expect(validatePhone(null,null)).to.be.true();
        expect(validatePhone(null,'US')).to.be.true();
        expect(validatePhone('9991231782',null)).to.be.true();

        // Providing an unsupported country is valid (we don't want it to block the user)
        expect(validatePhone('+16043657894','BE')).to.be.true();
    });

    it('should not allow invalid phone numbers', function(){

        // CA (allows numbers, +, -, ( and ) should be exact 10 digits
        expect(validatePhone('123-456-78909','CA')).to.be.false();
        expect(validatePhone('604-qw365-7894','CA')).to.be.false();
        expect(validatePhone('604-!365-7894','CA')).to.be.false();
        expect(validatePhone('*604-365-7894','CA')).to.be.false();
        expect(validatePhone('604365789478','CA')).to.be.false();

        // US (only allows digits to see that it's working)
        expect(validatePhone('604-365-7894','US')).to.be.false();
        expect(validatePhone('6043657894qw','US')).to.be.false();
        expect(validatePhone('+16043657894','US')).to.be.false();

    });
});