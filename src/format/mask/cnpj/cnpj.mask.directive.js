(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMaskCnpj', uiMaskCnpj);

    function uiMaskCnpj(uiCnpjFilter, $timeout) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var beforeSelIndex, afterSelIndex, futureSelIndex;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
            });

            ctrl.$parsers.push(function(value){
                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = uiCnpjFilter(value);
                ctrl.$setValidity('cnpj', isValidCnpj(viewValue));
                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 2 && afterSelIndex == 3:
                            futureSelIndex = 4;
                            break;
                        case beforeSelIndex == 6 && afterSelIndex == 7:
                            futureSelIndex = 8;
                            break;
                        case beforeSelIndex == 10 && afterSelIndex == 11:
                            futureSelIndex = 12;
                            break;
                        case beforeSelIndex == 15 && afterSelIndex == 16:
                            futureSelIndex = 17;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 18)
                    return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue)
                    return '';
            });

            ctrl.$formatters.push(function(value) {
                value = typeof value == 'number' ? value.toString() : value;
                if (value) value = ("00000000000000" + value).substring((14 + value.length) - 14);
                return uiCnpjFilter(value);
            });

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                    caretPos = elem.selectionStart;
                }

                return caretPos;
            }

            function setCaretPosition(elem, caretPos) {
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    }
                    else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        }
                        else {
                            elem.focus();
                        }
                    }
                }
            }

            function isValidCnpj(cnpj) {
                if(!cnpj)return true;

                if(cnpj.length >= 18) {
                    var valid = true;
                    cnpj = cnpj.replace(/[^\d]+/g, '');

                    if (cnpj.length != 14) valid = false;

                    if (cnpj == "00000000000000" ||
                        cnpj == "11111111111111" ||
                        cnpj == "22222222222222" ||
                        cnpj == "33333333333333" ||
                        cnpj == "44444444444444" ||
                        cnpj == "55555555555555" ||
                        cnpj == "66666666666666" ||
                        cnpj == "77777777777777" ||
                        cnpj == "88888888888888" ||
                        cnpj == "99999999999999") valid = false;

                    var size = cnpj.length - 2;
                    var numbers = cnpj.substring(0, size);
                    var digits = cnpj.substring(size);
                    var sum = 0;
                    var pos = size - 7;
                    for (var i = size; i >= 1; i--) {
                        sum += numbers.charAt(size - i) * pos--;
                        if (pos < 2)
                            pos = 9;
                    }
                    var result = sum % 11 < 2 ? 0 : 11 - sum % 11;
                    if (result != digits.charAt(0))
                        valid = false;

                    size = size + 1;
                    numbers = cnpj.substring(0, size);
                    sum = 0;
                    pos = size - 7;
                    for (var i = size; i >= 1; i--) {
                        sum += numbers.charAt(size - i) * pos--;
                        if (pos < 2)
                            pos = 9;
                    }
                    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
                    if (result != digits.charAt(1))
                        valid = false;

                    if (!valid)
                        return false;
                }
                return true;
            }
        }
    }

})();