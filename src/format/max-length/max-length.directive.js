(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMaxlength', uiMaxLength);

    function uiMaxLength() {
        var directive = {
            restrict: 'A',
            link: link,
            require: ['ngModel', '?^form'],
            scope: {
                uiMaxlength: '='
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            scope.$watch('uiMaxlength', function (value, oldValue) {
                element.attr('maxlength', value);
            });
            // ctrl[0].$formatters.unshift(formatValue);
            // ctrl[0].$parsers.unshift(formatValue);
            function formatValue(value) {
                if (!value || !scope.uiMaxLength)
                    return value;
                var newValue = value.toString();
                var maxLength = parseInt(scope.uiMaxLength);
                if (isNaN(maxLength))
                    return;
                newValue = newValue.substring(0, maxLength);
                var isModelPristine = ctrl[0].$pristine,
                    isFormPristine = ctrl[1] ? ctrl[1].$pristine : false;
                ctrl[0].$setViewValue(newValue);
                ctrl[0].$render();
                isModelPristine && ctrl[0].$setPristine();
                isFormPristine && ctrl[1].$setPristine();
                return newValue;
            }
        }
    }

})();

