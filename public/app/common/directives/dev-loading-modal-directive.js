'use strict';

/* @ngInject */
var DnbLoadingModal = function () {
    return {
        scope: {
            showModal: '='
        },
        template: require('./dnb-loading-modal.html')
    };
};

module.exports = DnbLoadingModal;
