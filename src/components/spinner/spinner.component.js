(function() {
	'use strict';

	angular
		.module('smn-ui')
		.component('uiSpinner', {
			templateUrl: 'components/spinner/spinner-icon.tpl.html',
			controller: uiSpinnerController
		});

	uiSpinnerController.$inject = ['$element'];
	function uiSpinnerController($element) {
		var $ctrl = this;

		$ctrl.$onInit = function() { };
		$ctrl.$onChanges = function(changesObj) { };
		$ctrl.$onDestory = function() { };
	}
})();