(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiTrigger', uiTrigger);

    function uiTrigger() {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                'uiTrigger': '@',
                'uiTriggerEvent': '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            element.bind(scope.uiTriggerEvent, function () {
                angular.element(scope.uiTrigger).trigger(scope.uiTriggerEvent);
            });
        }
    }

})();

