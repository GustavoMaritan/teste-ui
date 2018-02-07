(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMaskCpf', uiMaskCpf);

    function uiMaskCpf(uiCpfFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                var viewValue = uiCpfFilter(value);
                ctrl.$setValidity('cpf', isValidCpf(viewValue));
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                if (viewValue.length === 14) return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                value = typeof value == 'number' ? value.toString() : value;
                if (value) value = ("00000000000" + value).substring((11 + value.length) - 11);
                    return uiCpfFilter(value);
            });

            function isValidCpf(cpf) {
                if(!cpf)return true;

                if (cpf.length >= 14) {
                    var valid = true;

                    cpf = cpf.replace(/[^\d]+/g, '');

                    if (cpf.length != 11) valid = false;

                    var sum;
                    var rest;
                    sum = 0;
                    if (cpf == "00000000000" ||
                        cpf == "11111111111" ||
                        cpf == "22222222222" ||
                        cpf == "33333333333" ||
                        cpf == "44444444444" ||
                        cpf == "55555555555" ||
                        cpf == "66666666666" ||
                        cpf == "77777777777" ||
                        cpf == "88888888888" ||
                        cpf == "99999999999") valid = false;

                    for (var i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
                    rest = (sum * 10) % 11;

                    if ((rest == 10) || (rest == 11)) rest = 0;
                    if (rest != parseInt(cpf.substring(9, 10))) valid = false;

                    sum = 0;
                    for (var i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
                    rest = (sum * 10) % 11;

                    if ((rest == 10) || (rest == 11)) rest = 0;
                    if (rest != parseInt(cpf.substring(10, 11))) valid = false;

                    if (!valid)
                        return false;
                }
                return true;
            }
        }
    }

})();