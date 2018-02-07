(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiAutofocus', uiAutofocus);

    uiAutofocus.$inject = ['$timeout'];

    /* @ngInject */
    function uiAutofocus($timeout) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            $timeout(function () {
                element[0].focus();
            })
        }
    }

})();

