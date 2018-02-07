(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMaskPhonenumber', uiMaskPhonenumber);

    function uiMaskPhonenumber(uiPhonenumberFilter, $timeout) {
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

                var viewValue = uiPhonenumberFilter(value);
                ctrl.$setViewValue(uiPhonenumberFilter(viewValue));
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 4 && afterSelIndex == 5:
                            futureSelIndex = 6;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 9 || viewValue.length === 10)
                    return viewValue.replace(/[^0-9]+/g,'');
                if (!viewValue)
                    return '';
            });

            ctrl.$formatters.push(function(value){
                return uiPhonenumberFilter(value);
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
        }
    }

})();