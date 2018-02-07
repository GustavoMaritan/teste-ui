(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiChip', uiChip);

    uiChip.$inject = ['$timeout'];

    /* @ngInject */
    function uiChip($timeout) {
        var directive = {
            require: '^^uiChips',
            templateUrl: 'form/chips/chip.html',
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            scope.ctrl = ctrl;
            element.attr('tabindex', -1);
            element.bind('keydown', function (e) {
                switch (e.keyCode) {
                    case 37:
                        var target = element.is(':first-child') ? element.siblings(':last-child') :element.prev();
                        target.focus();
                        break;
                    case 39:
                        element.next().focus();
                        break;
                }
            });
        }
    }

})();