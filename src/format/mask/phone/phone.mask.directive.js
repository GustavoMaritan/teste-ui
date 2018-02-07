(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMaskPhone', uiMaskPhone);

    function uiMaskPhone(uiPhoneFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function(value){
                var viewValue = uiPhoneFilter(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                if (viewValue.length === 14 || viewValue.length === 15)
                    return viewValue.replace(/[^0-9]+/g,'');
                if (!viewValue)
                    return '';
            });

            ctrl.$formatters.push(function(value){
                return uiPhoneFilter(value);
            });
        }
    }

})();