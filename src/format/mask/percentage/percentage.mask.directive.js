(function () {
    'use strict';

    uiMaskPercentage.$inject = ["uiPercentageFilter"];
    angular.module('smn-ui').directive('uiMaskPercentage', uiMaskPercentage);

    function uiMaskPercentage(uiPercentageFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value, oldValue) {
                
                if(!value) return;

                var percentVal = +attrs.uiMaxPercentage;

                function adjustMaxPercentage(reg) {
                    if (value.match(reg) && value.match(/%/g)) percentVal += value.match(reg).length + value.match(/%/g).length - 1;
                }

                adjustMaxPercentage(/(-)|(,)/g);

                var viewValue = uiPercentageFilter(value.substring(0, percentVal));

                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionEnd >= viewValue.length) {
                    element[0].selectionEnd = viewValue.length - 1;
                    element[0].selectionStart = viewValue.length - 1;
                }

                element.bind("keyup", function (event) {
                    if ((event.which === 8 || event.which === 46) && element[0].value.includes('-%')) ctrl.$setViewValue('');
                });
                return parseFloat(viewValue.replace('%','').replace(',','.'));
            });
            ctrl.$formatters.push(function (value) {
                if(!value) return;
                var uiPF = uiPercentageFilter(value);
                return uiPF;
            });
        }
    }
})();