(function() {
    'use strict';

    angular
        .module('smn-ui')
        .component('uiInputContainer', {
            controller: uiInputContainerController,
            require: '?ngModel',
            bindings: {
                'ngModel': '=?'
            }
        });

    uiInputContainerController.$inject = ['$element'];
    function uiInputContainerController($element) {
        var $ctrl = this;

        $ctrl.$postLink = function () {
            $element.children('select, input, textarea, ui-chips')
                .addClass('ui-control')
                .after('<div class="line"></div>');
        };
    }
})();