(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMinute', uiMinute);

    function uiMinute(uiMinuteFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel',
            scope: { }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function(value){
                var viewValue = formatValue(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                viewValue = /^([0-9]|[1-4][0-9]|5[0-9])$/.test(viewValue) ? viewValue : undefined;
                return viewValue;
            });
            ctrl.$formatters.push(formatValue);

            function formatValue(value) {
                return uiMinuteFilter(value);
            }
        }
    }

})();

