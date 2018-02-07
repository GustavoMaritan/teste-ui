(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiTab', uiTab);

    function uiTab() {

        var directive = {
            templateUrl: 'components/tabs/tab.directive.tpl.html',
            require: '^uiTabs',
            transclude: true,
            restrict: 'E',
            link: link,
            scope: {
                name: '@',
                icon: '@'
            },
        };

        return directive;

        function link(scope, element, attrs, ctrl) {
            scope.ctrl = ctrl;
            ctrl.add(scope);

            scope.$on('$destroy', function() {
                ctrl.remove(scope);
            });
        }
    }

})();

