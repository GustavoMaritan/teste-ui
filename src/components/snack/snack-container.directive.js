(function() {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiSnackContainer', uiSnackContainer);

	uiSnackContainer.$inject = ['uiSnack', '$templateCache', '$timeout'];

	function uiSnackContainer(uiSnack, $templateCache, $timeout) {
		var directive = {
			link: link,
            templateUrl: 'components/snack/snack-container.directive.html',
			restrict: 'E'
		};
		return directive;
		
		function link(scope, element, attrs) {
			var timeout;
			scope.bars = [];
			uiSnack.newAdded(function (bar) {
				// TENTAR TROCAR O NG-REPEAT POR INSERIR UM ELEMENTO
				// USANDO O $animate.enter PRA USAR OS CALLBACK -~
				bar = angular.extend({}, uiSnack.getDefaults(), bar);
				scope.bars.push(bar);
				if (scope.bars.length == 1)
					timerBar();
			});
			function finishTimeout() {
				scope.bars.shift();
				if (scope.bars.length)
					timerBar();
			}
			function timerBar() {
				if (scope.bars.length && scope.bars[0].delay)
					timeout = $timeout(finishTimeout, scope.bars[0].delay);
			}
			uiSnack.onHide(function () {
				if (timeout)
					$timeout.cancel(timeout);
				finishTimeout();
			});
		}
	}
})();