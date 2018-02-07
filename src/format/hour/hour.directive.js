(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiHour', uiHour);

    function uiHour(uiHourFilter) {
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
                viewValue = /^([0-9]|1[0-9]|2[0-3])$/.test(viewValue) ? viewValue : undefined;
                return viewValue;
            });
            ctrl.$formatters.push(formatValue);

            function formatValue(value) {
                return uiHourFilter(value);
            }
        }
    }

})();

