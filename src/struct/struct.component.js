(function() {
    'use strict';

    angular
        .module('smn-ui')
        .component('uiStruct', {
            controller: uiStructController
        });

    function uiStructController($element, $window) {
        var $ctrl = this;

        $ctrl.$postLink = function () {
            angular.element($window).bind('scroll', function (e) {
                if (window.pageYOffset)
                    $element.addClass('not-on-top');
                else
                    $element.removeClass('not-on-top');
            });
        };
    }
})();