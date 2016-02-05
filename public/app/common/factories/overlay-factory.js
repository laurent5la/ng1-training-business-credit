/**
 * @project cirrus-ui
 *
 * @description A service that displays commonly used dialogs, such as confirm to continue, warning
 */
'use strict';

/* @ngInject */
var OverlayFactory = function ($uibModal) {
    var service = {

        /**
         * Confirm with user before leaving the page.
         * @param title
         * @param message
         * @param no
         * @param yes
         * @returns {Object|details.result|*|result}
         */
        confirm: function (title, message, yes, no, warning) {

            var template = warning ? require('./warning-overlay.html') : require('./confirm-overlay.html');
            var overlay = service.overlay({
                template: template,
                controller: ['$scope', function ($scope) {

                    $scope.title = title;
                    $scope.message = message;
                    $scope.no = no;
                    $scope.yes = yes;

                    $scope.yesClicked = function () { //yes navigate away
                        overlay.close();
                    };

                    $scope.noClicked = function () { //no stay on this page
                        overlay.dismiss('cancel');
                    };
                }]
            });

            return overlay.result;
        },

        /**
         * Confirm with user, Use a Warning Template instead of a regular one
         */
        warning : function(title, message, yes, no) {
            return service.confirm(title, message, yes, no, true);
        },

        /**
         * Simple Okay Dialog Modal
         */
        okay : function(title, message, ok) {
            var overlay = service.overlay({
                template: require('./okay-overlay.html'),
                controller: ['$scope', function ($scope) {

                    $scope.title = title;
                    $scope.message = message;
                    $scope.ok = ok;

                    $scope.okClicked = function () { //yes navigate away
                        overlay.close();
                    };
                }]
            });

            return overlay.result;
        },

        /**
         * Show a video in a popup modal
         * @param video - the id of the youtube video
         * @param autoplay - true to play the video as soon as it loads
         */
        video: function (video, autoplay) {
            var overlay = service.overlay({
                template: '<div class="modal-body"><dnb-video video="{{video}}" autoplay="{{autoplay}}" /></div>',
                windowClass: 'dnb-video-modal',
                controller: ['$scope', function ($scope) {
                    $scope.video = video;
                    $scope.autoplay = autoplay ? 'true' : 'false';
                }]
            });
            return overlay.result;
        },

        /**
         * General overlay to be used
         * @param options controller, template
         * @returns {*|Window}
         */
        overlay: function (options) {
            return $uibModal.open(options);
        }
    };

    return service;
};

module.exports = OverlayFactory;
