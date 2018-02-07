(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMaskCurrency', uiMaskCurrency);

    function uiMaskCurrency($timeout, $locale, uiCurrencyFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
            var beforeSelIndex, afterSelIndex, futureSelIndex;
            var beforeViewValue, afterViewValue;
            var beforeModelValue;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
                beforeViewValue = ctrl.$viewValue;
                beforeModelValue = ctrl.$modelValue;
            });

            ctrl.$parsers.push(function(value){
                var isDeletingZero = beforeViewValue == ('0' + decimalSep + '00') && value.length < beforeViewValue.length;
                value = isDeletingZero ? '' : value;

                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = uiCurrencyFilter(value);
                afterViewValue = viewValue;

                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                var removeGroupSep = new RegExp('[^\\d\\' + decimalSep + ']+', 'g');
                var modelValue = viewValue.replace(removeGroupSep, '');
                modelValue = parseFloat(modelValue.replace(decimalSep, '.'));
                validateRange(modelValue);

                if (!viewValue && typeof viewValue != 'number') {
                    return null;
                }

                // Corrige o index do cursor de seleção
                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case (afterViewValue.length - beforeViewValue.length == 2):
                            futureSelIndex = beforeSelIndex + 2;
                            break;
                        case (!beforeViewValue || !modelValue):
                            futureSelIndex = afterViewValue.length;
                            break;
                        case (beforeModelValue.toString().length === modelValue.toFixed(2).length && modelValue.toString().search(/e/) == -1):
                            // É verificado a existência de "e" na string pois se ela estourar o limite do Javascript o length não é confiável
                            futureSelIndex = beforeSelIndex;
                            break;
                        case (value.length == 1):
                            futureSelIndex = viewValue.length;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }
                return modelValue;
            });

            ctrl.$formatters.push(function(value){
                validateRange(value);
                return uiCurrencyFilter(value);
            });

            function validateRange(value) {
                ctrl.$setValidity('max', true);
                ctrl.$setValidity('min', true);
                ctrl.$setValidity('maxDigit', true);
                ctrl.$setValidity('minDigit', true);
                if (!value)
                    return true;

                var valueLength = value.toString().replace(/[^\d]+/g, '').length;
                if (attrs.max) {
                    var max = parseFloat(attrs.max);
                    ctrl.$setValidity('max', value <= max);
                }
                if (attrs.min) {
                    var min = parseFloat(attrs.min);
                    ctrl.$setValidity('min', value >= min);
                }
                if (attrs.maxDigit) {
                    var maxDigit = parseInt(attrs.maxDigit);
                    ctrl.$setValidity('maxDigit', valueLength <= maxDigit);
                }
                if (attrs.minDigit) {
                    var minDigit = parseInt(attrs.minDigit);
                    ctrl.$setValidity('minDigit', valueLength >= minDigit);
                }
            }

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
                elem.value = elem.value;
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
        }
    }

})();