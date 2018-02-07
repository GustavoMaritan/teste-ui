(function() {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiSnackBar', uiSnackBar);

	uiSnackBar.$inject = ['uiSnack', '$templateCache'];

	function uiSnackBar(uiSnack, $templateCache) {
		var directive = {
			link: link,
            templateUrl: 'components/snack/snack-bar.directive.html',
			restrict: 'E',
			scope: {
				'uiBar': '='
			}
		};
		return directive;
		
		function link(scope, element, attrs) {
		}
	}
})();