/**
 * Created by zhangle on 15-07-09.
 */
'use strict';

// We are using protractor,element and by which are defined by protractor lib
/* global browser: false */
/* global by: false  */
/* global element: false */
/* global before: false */
/* global after: false */

var chai = require('chai');
var expect = chai.expect;
var mockAuth = require(require('path').resolve('./protractor-helpers/mock-auth'));


describe('Highlight Active tab in the left navigation', function () {
    var ptor;
    var driver;         // for traversing the iframe's contents

    before(function(){
        ptor = browser;
        driver = ptor.driver;
        mockAuth.login(ptor);
    });

    afterEach(function () {
        ptor.executeScript('window.sessionStorage.clear();');
    });

    after(function(){
        mockAuth.logout(ptor);
    });



    // Expected: direct to note url, note tab should be highlight
    it('Single Tab Case: The Notes tab should be highlighted', function () {
        ptor.get('/report/201516002/tab/notes?country=CA');
        element.all(by.css('.dnb-wrapper-leftnav ul.cirrus-tabs li.active > a')).getText().then(function (text) {
            expect(text[1]).to.equal('Notes and Documents');
        });
    });

    //TODO: will include the test case below when CIR-7765 is resolved

    //// 1. Go to summary page
    //// 2. Click on company profile
    //// Expected: Navigate to company profile page and the tab is highlight
    //it('The Company Profile tab should be highlighted when clicking from the summary page', function () {
    //    ptor.get('/report/201516002?country=CA');
    //
    //    element.all(by.css('.tab-content-ui-view .panel-title > a')).first().then(function(companyProfileEle) {
    //        companyProfileEle.click().then(function() {
    //
    //            element(by.css('.dnb-wrapper-leftnav .cirrus-tabs-div ul li.active')).getText().then(function(text) {
    //                expect(text).to.equal('Company Profile');
    //            });
    //
    //        });
    //    });
    //});

    it('Nested Tab Case: Trade payment child tab should be highlighted.', function () {
        ptor.get('/report/201516002/tab/trade-payments-payment-details');
        element.all(by.css('.dnb-wrapper-leftnav ul.cirrus-tabs li.active > a span')).getText().then(function (text) {
            expect(text[0]).to.equal('Payment Details');
        });
    });

});
