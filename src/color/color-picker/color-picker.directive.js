(function () {
    'use strict';
    angular
        .module('smn-ui')
        .directive('uiColorPicker', function($timeout){
            return {
                restrict: 'E',
                transclude: true,
                require: ['^form','ngModel'],
                scope: {
                    'ngModel': '=',
                    'uiId': '@',
                    'uiName': '@',
                    'uiClass': '=?',
                    'uiShape': '@',
                    'uiPrimaryInfo': '@',
                    'uiSelect': '&'
                },
                templateUrl: 'color/color-picker/color-picker.directive.html',
                link: function(scope, element, attrs, ctrls, transclude) {
                    // element.find('ui-form-transclude').replaceWith(transclude());
                    scope.colorTypes = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];
                    scope.colorVariations = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
                    scope.switchOpened = false;
                    scope.colorTypeSelected = undefined;
                    scope.colorSelected = undefined;
                    scope.switchOpen = function(){
                        scope.colorTypeSelected = undefined;
                        scope.switchOpened = true;
                    };
                    scope.switchClose = function(){
                        scope.switchOpened = false;
                    };
                    scope.switchVarTop = undefined;
                    scope.switchVarArrowLeft = undefined;
                    scope.setColorType = function($event, color){
                        scope.colorTypeSelected = color;
                        if (color == undefined) {
                            scope.selectColor();
                            return;
                        }
                        scope.switchVarTop = angular.element($event.currentTarget).offset().top - angular.element(element.find('.switch-color')).offset().top - 50;
                        scope.switchVarArrowLeft = angular.element($event.currentTarget).offset().left - angular.element(element.find('.switch-color')).offset().left + (angular.element($event.currentTarget).width() / 2) - 6;
                    };
                    scope.colorClass = function(color){
                        return color;
                    };
                    scope.checkAccentColor = function(variation){
                        if (scope.colorTypeSelected == 'brown' || scope.colorTypeSelected == 'grey' || scope.colorTypeSelected == 'blue-grey') {
                            if (variation == 'A100' || variation == 'A200' || variation == 'A400' ||  variation == 'A700')
                                return false;
                        }
                        return true;
                    };

                    angular.element(document).bind('mousedown focusin', function(e){
                        if (!angular.element(element).find(e.target).length && scope.switchOpened) {
                            scope.switchClose();
                            scope.$apply();
                        }
                    });
                    scope.selectColor = function($event) {
                        scope.colorSelected = $event ? rgb2hex($($event.currentTarget).css('background-color')).toUpperCase() : undefined;
                        ctrls[1].$setViewValue(scope.colorSelected ? scope.colorSelected : 'Nenhuma cor selecionada')
                        ctrls[1].$render();
                        ctrls[0][scope.uiName].$setDirty();
                        scope.switchClose();
                        $timeout(scope.uiSelect);
                    };

                    ctrls[1].$formatters.push(function(value){
                        scope.colorSelected = value;
                        ctrls[1].$setViewValue(value ? value : 'Nenhuma cor selecionada');
                        ctrls[0].$setPristine(); // Dentro do formatters, faz o campo nascer como pristine, caso contrÃ¡rio ele perde a propriedade
                        return value;
                    });

                    function rgb2hex(rgb) {
                        var hexDigits = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
                        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                        function hex(x) {
                            return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
                        }
                        return '#' + (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
                    }

                }
            }
        });
})();