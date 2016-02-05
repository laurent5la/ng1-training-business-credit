'use strict';

/* @ngInject */
var DnBTabsDirective = function ($log, $state) {
    return {
        restrict: 'E',
        template: require('./dnb-left-tabs.html'),
        scope: {
            tabs: '='
        },
        link: function (scope) {

            scope.expandOrGo = function(tab) {
                if (tab.disabled) {
                    return;
                }
                if (tab.subTabs) {
                    tab.expanded = !tab.expanded;
                }else if (tab.name) {
                    $state.go(tab.name);
                }
            };

            function init() {
                findActiveTab();
                var watchStateChange = scope.$on('$stateChangeSuccess', findActiveTab);
                scope.$on('$destroy', watchStateChange);
            }

            function findActiveTab() {
                if ($state.current.name) {
                    scope.currentTabName = $state.current.name;
                }
            }

            init();

        }
    };
};

module.exports = DnBTabsDirective;
