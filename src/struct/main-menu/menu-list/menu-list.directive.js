(function() {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiMenuList', uiMenuList);

	uiMenuList.$inject = ['$templateCache'];

	function uiMenuList($templateCache) {
		var directive = {
			require: '^uiMainMenu',
			link: link,
			restrict: 'E',
            templateUrl: 'struct/main-menu/menu-list/menu-list.directive.html',
			scope: {
				'list': '=',
				'parentLevel': '='
			}
		};
		return directive;
		
		function link(scope, element, attrs, ctrl) {
			scope.level = scope.parentLevel + 1;
			scope.config = ctrl.config;
		}
	}
})();