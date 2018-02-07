(function() {
    'use strict';

    angular
        .module('smn-ui')
        .component('uiAutocomplete', {
            controller: uiAutocompleteController,
            require: {
                ngModelCtrl: 'ngModel'
            },
            templateUrl: 'form/autocomplete/autocomplete.html',
            bindings: {
                'ngModel': '=',
                'uiItems': '=',
                'required': '=',
                'uiDisabled': '=',
                'uiItemsValue': '@',
                'uiPrimaryInfo': '@',
                'uiSecondaryInfo': '@',
                'uiLabel': '@',
                'uiTrackBy': '@',
                'searchQuery': '=uiSearchQuery',
                'searchFunction': '=uiSearchFunction',
                'selectFunction': '=uiSelectFunction',
                'uiFocus': '&',
                'uiBlur': '&',
                'uiChange': '&',
                'placeholder': '@',
                'name': '@'
            }
        });

    function uiAutocompleteController($element, $timeout) {
        var $ctrl = this;
        $ctrl.ngModel = $ctrl.ngModel || [];
        $ctrl.uiItemsFiltered = [];
        $ctrl.focusedIndex = 0;
        $ctrl.$onInit = function () {

            $element.attr('tabindex', -1);
            $element.bind('click', function (e) {
                if (angular.element(e.target).is('ui-autocomplete'))
                    $element.find('input').focus();
            });
            $element.on('focus', '> *', function (e) {
                $element.addClass('ui-focused');
            });
            $element.on('blur', '> *', function (e) {
                $element.removeClass('ui-focused');
            });
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
        var searchTimeout;
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
        $ctrl.blur = function (query) {
            $ctrl.searchFunction(query);
            $ctrl.showItems()
        };

        $ctrl.searchItem = function (query) {
            $ctrl.searchQuery = query;
            $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(function () {
                $ctrl.searchFunction(query);
                $ctrl.showItems();
            }, 300);
        };

        $ctrl.selectItem = function (item) {
            $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            $ctrl.ngModel = $ctrl.uiItemsValue ? item[$ctrl.uiItemsValue] : item;
            $ctrl.ngModelCtrl.$modelValue = $ctrl.ngModel;
            $ctrl.ngModelCtrl.$setDirty();
            $element.find('input').focus();
            $ctrl.selectFunction && $ctrl.selectFunction(item);
            $timeout(function () {
                $ctrl.searchQuery = $ctrl.ngModel[$ctrl.uiPrimaryInfo];
                $ctrl.hideItems();
            });
        };
    }
})();
