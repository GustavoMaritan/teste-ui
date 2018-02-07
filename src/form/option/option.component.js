(function () {
	'use strict';

	angular
		.module('smn-ui')
		.component('uiOption', {
            controller: uiOptionController
        });

	uiOptionController.$inject = ['$element'];

	function uiOptionController($element) {
	    var $ctrl = this;
        $ctrl.$postLink = function () {
            $element
                .wrapInner('<label></label>');
            $element
                .find('input')
                .addClass('ui-option')
                .after('<div class="ui-option-shell"><div class="ui-option-fill"></div><div class="ui-option-mark"></div></div>');
        }
	}
})();