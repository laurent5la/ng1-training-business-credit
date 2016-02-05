'use strict';

module.exports = angular.module('common.services', [])
    .service('locationFactory', require('./location-factory'))
    .service('firstrainFactory', require('./firstrain-factory'))
    .factory('dynamicLoad', require('./dynamic-load'))
    .factory('addressFactory', require('./address-factory'))
    .factory('stateFactory', require('./state-factory'))
    .factory('overlayFactory', require('./overlay-factory'))
    .factory('utils', require('./utils'))
    .factory('dnbStorageFactory', require('./dnb-storage-factory'))
    .factory('helpFactory', require('./help-factory'))
    .factory('currencyFactory', require('./currency-factory'));
