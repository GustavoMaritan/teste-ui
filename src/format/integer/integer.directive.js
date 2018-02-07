(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiInteger', uiInteger);

    uiInteger.$inject = ['uiIntegerFilter'];

    function uiInteger(uiIntegerFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel',
            scope: {
                uiIntegerDigitMax: '=?'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function(value){
                var viewValue = formatValue(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                return viewValue;
            });
            ctrl.$formatters.push(formatValue);
            function formatValue(value) {
                var newValue = uiIntegerFilter(value);
                if (scope.uiIntegerDigitMax && typeof newValue === 'number') {
                    var maxDigit = parseInt(scope.uiIntegerDigitMax);
                    if (!isNaN(maxDigit)) {
                        newValue = parseInt(newValue.toString().substring(0, maxDigit));
                    }
                }
                return newValue;
            }
        }
    }

})();

