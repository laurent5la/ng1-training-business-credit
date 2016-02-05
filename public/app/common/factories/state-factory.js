'use strict';

/**
 *  Service to block/unblock state changes when user is editing a form.
 * @param $log
 * @param $state
 * @param $rootScope
 * @returns {{blockStateChange: Function, unblockStateChange: *}}
 * @constructor
 */
/* @ngInject */
var StateFactory = function ($log, $state, $rootScope) {

    /**
     * Since there may be multiple forms on the same page, all conditions must be tracked
     * @type {Array}
     */
    var blockingConditions = [],

        /**
         * Adds a blocking condition onto blocking conditions list
         * @param blockConditionFunc
         * @param onBlockFunc
         */
        registerBlockingCondition = function (blockConditionFunc, onBlockFunc) {

            var name = blockingConditions.length;
            blockingConditions.push({
                name: blockingConditions.length,
                shouldBlock: blockConditionFunc,
                onBlockCallback: onBlockFunc
            });

            $log.debug('blockingCondition ' + name + ' was registered');
        },
        /**
         * Removes a blocking condition from list of registered blocking conditions
         * @param index
         */
        deregisterBlockingCondition = function (index) {

            if (blockingConditions.length > 0) {

                blockingConditions.splice(index, 1);
                $log.debug('blockingCondition ' + (index + 1) + ' was deregistered');
                if (blockingConditions.length === 0) {
                    service.deregisterStateChangeStart(); //no need to track state changes
                }
            }
        },

        /**
         * Deregisters all blocking conditions
         */
        deregisterBlockingConditions = function () {
            blockingConditions = [];
            if (angular.isDefined(service.deregisterStateChangeStart)) {
                service.deregisterStateChangeStart();
            }

            $log.debug('all blockingConditions were deregistered');
        },
        service = {


            /**
             * Tracks state changes and prevents the user from navigating away to another page if blockingCondition is satisfied.
             *
             * @param {function} blockConditionFunc a condition to check against. if the condition is true, state change is blocked,
             * @param {function} onBlockFunc
             */
            blockStateChange: function (blockConditionFunc, onBlockFunc) {


                if (blockingConditions.length === 0) {
                    service.deregisterStateChangeStart = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState/*, fromParams*/) {


                        var shouldBlock = false,
                            blockingCondition,
                            i;
                        for (i = 0; i < blockingConditions.length; i++) {
                            blockingCondition = blockingConditions[i];
                            if (blockingCondition.shouldBlock()) {
                                shouldBlock = true;
                                $log.debug('blockingCondition ' + blockingCondition.name + ' was met');
                                break;
                            }
                        }

                        if (shouldBlock) { //blocking condition is met

                            event.preventDefault(); //prevent state change

                            //invoke callback function (prompt the user for instructions)

                            blockingCondition.onBlockCallback().then(function () { //User wants to navigate away
                                deregisterBlockingCondition(i);
                                $state.go(toState, toParams);
                            });

                        } else { //blocking condition was not met, stop tracking state changes
                            deregisterBlockingCondition(i);
                        }


                        $log.debug('in state ' + fromState.name + ' and blockingCondition is ' + blockingCondition.shouldBlock());


                    });
                }


                registerBlockingCondition(blockConditionFunc, onBlockFunc);


            },

            /**
             * Lets user state change
             */
            unblockStateChange: deregisterBlockingConditions

        };

    return service;

};

module.exports = StateFactory;
