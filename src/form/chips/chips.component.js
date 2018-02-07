(function() {
    'use strict';

    angular
        .module('smn-ui')
        .component('uiChips', {
            controller: uiChipsController,
            require: {
                ngModelCtrl: 'ngModel'
            },
            templateUrl: 'form/chips/chips.html',
            bindings: {
                'ngModel': '=',
                'uiItems': '=',
                'required': '=',
                'uiItemsValue': '@',
                'uiPrimaryInfo': '@',
                'chipTemplateUrl': '@',
                'uiItemsAllowCustom': '@',
                'changeFunction': '=?',
                'uiTrackBy': '@',
                'uiSearchQuery': '=searchQuery',
                'placeholder': '@',
                'secondaryPlaceholder': '@',
                'uiLimit': '=',
                'min': '=',
                'max': '=',
                'name': '@'
            }
        });

    function uiChipsController($element, $timeout) {
        var $ctrl = this;
        $ctrl.ngModel = $ctrl.ngModel || [];
        $ctrl.uiItemsFiltered = [];
        $ctrl.focusedIndex = 0;
        $ctrl.$onInit = function () {
            $element.attr('tabindex', -1);
            $element.bind('click', function (e) {
                if (angular.element(e.target).is('ui-chips'))
                    $element.find('input').focus();
            });
            $element.on('focus', '> *', function (e) {
                $element.addClass('ui-focused');
            });
            $element.on('blur', '> *', function (e) {
                $element.removeClass('ui-focused');
            });
            $ctrl.ngModelCtrl.$validators.min = isMinValid;
        };

        function isMinValid(value) {
            return !angular.isNumber($ctrl.min) || value.length >= $ctrl.min;
        }

        function isMaxValid(value) {
            return !angular.isNumber($ctrl.max) || value.length <= $ctrl.max;
        }

        $ctrl.chipKeyAction = function (event, index) {
            if ([8,46].indexOf(event.which) > -1) {
                $ctrl.removeChip(index);
                var focusIndex = !$ctrl.ngModel.length ? 1 : (index === $ctrl.ngModel.length ? index - 1 : index + 1);
                $element.children().eq(focusIndex).focus();
            }
        };

        $ctrl.inputKeyAction = function (event) {
            switch (event.which) {
                case 8:
                case 37:
                    if ($ctrl.ngModel && !$ctrl.searchQuery)
                        $element.children('input').prev().focus();
                    break;
                case 38:
                    $ctrl.focusedIndex = !$ctrl.uiItemsFiltered.length ? null : $ctrl.focusedIndex ? $ctrl.focusedIndex - 1 : $ctrl.uiItemsFiltered.length - 1;
                    break;
                case 40:
                    $ctrl.focusedIndex = !$ctrl.uiItemsFiltered.length ? null : $ctrl.uiItemsFiltered.length - 1 === $ctrl.focusedIndex ? 0 : $ctrl.focusedIndex + 1;
                    break;
                case 13:
                    if ($ctrl.searchQuery && !$ctrl.uiItems) {
                        $ctrl.ngModel.indexOf($ctrl.searchQuery) === -1 && $ctrl.ngModel.push(angular.copy($ctrl.searchQuery));
                        $ctrl.searchQuery = '';
                    } else if ($ctrl.uiItemsFiltered) {
                        if (typeof $ctrl.focusedIndex === 'number')
                            $ctrl.selectItem($ctrl.uiItemsFiltered[$ctrl.focusedIndex]);
                    }
                    event.preventDefault();
                    break;
            }
        };

        var hideTimeout;
        $ctrl.itemsShown = false;
        $ctrl.showItems = function () {
            $timeout.cancel(hideTimeout);
            $ctrl.itemsShown = true;
            $timeout(function () {
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            });
        };
        $ctrl.hideItems = function () {
            hideTimeout = $timeout(function () {
                $ctrl.itemsShown = false;
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            });
        };
        $ctrl.filterRemoveSelected = function (item) {
            if ($ctrl.uiTrackBy) {
                for (var i = 0; i < $ctrl.ngModel.length; i++) {
                    if ($ctrl.ngModel[i][$ctrl.uiTrackBy] === item[$ctrl.uiTrackBy])
                        return false;
                }
                return true;
            }
            return $ctrl.uiItemsValue ? $ctrl.ngModel.indexOf(item[$ctrl.uiItemsValue]) === -1 : item;
        };
        $ctrl.checkFilteredItems = function () {
            $timeout(function () {
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? $ctrl.focusedIndex || 0 : null;
            });
        };
        $ctrl.selectItem = function (item) {
            $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            $ctrl.ngModel.push($ctrl.uiItemsValue ? item[$ctrl.uiItemsValue] : item);
            $ctrl.ngModelCtrl.$modelValue = $ctrl.ngModel;
            $ctrl.changeFunction && $ctrl.changeFunction(item);
            $element.find('input').focus();
            $ctrl.searchQuery = '';
            $ctrl.ngModelCtrl.$setDirty();
            $ctrl.ngModelCtrl.$setValidity('min', isMinValid($ctrl.ngModel));
            $ctrl.ngModelCtrl.$setValidity('max', isMaxValid($ctrl.ngModel));
        };
        $ctrl.removeChip = function (index) {
            if ($ctrl.ngModel.constructor !== Array)
                return;
            $ctrl.ngModel.splice(index, 1);
            $ctrl.changeFunction && $ctrl.changeFunction();
            $ctrl.ngModelCtrl.$setDirty();
            $ctrl.ngModelCtrl.$setValidity('min', isMinValid($ctrl.ngModel));
            $ctrl.ngModelCtrl.$setValidity('max', isMaxValid($ctrl.ngModel));
        };
    }
})();
