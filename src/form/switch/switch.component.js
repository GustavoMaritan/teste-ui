(function () {
	'use strict';

	angular
		.module('smn-ui')
		.component('uiSwitch', {
            controller: uiSwitchController
        });

	uiSwitchController.$inject = ['$element'];

	function uiSwitchController($element) {
	    var $ctrl = this;
        $ctrl.$postLink = function () {
            $element
                .wrapInner('<label></label>');
            $element
                .find('input')
                .addClass('ui-switch')
                .after('<div class="switch-cover"><div class="track"></div><div class="thumb-container"><div class="thumb"></div></div></div>');
        }
	}
})();