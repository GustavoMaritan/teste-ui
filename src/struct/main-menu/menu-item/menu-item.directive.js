(function() {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiMenuItem', uiMenuItem);

	uiMenuItem.$inject = ['$compile', '$templateCache'];

	function uiMenuItem($compile, $templateCache) {
		var directive = {
			require: '^uiMainMenu',
			link: link,
			restrict: 'E',
            templateUrl: 'struct/main-menu/menu-item/menu-item.directive.html',
			scope: {
				'item': '=',
				'list': '=',
				'level': '=',
				'isOpen': '='
			}
		};
		return directive;

		function link(scope, element, attrs, ctrl) {
			scope.isOpen = false;
			scope.menuClick = ctrl.menuClick;
			scope.config = ctrl.config;
			scope.openMenu = function() {
				if (scope.item[scope.config.submenu])
					scope.isOpen = !scope.isOpen;
			};
			scope.buttonOffset = scope.level != 1 ? (36 * (scope.level - 1) + 'px') : 0;
			if (scope.list) {
				$compile('<ui-menu-list class="drawer-slide-vertical" list="list" config="config" parent-level="level" ng-hide="!isOpen"></ui-menu-list>')(scope, function (cloned, scope){
					element.append(cloned);
				});
			}
		}
	}
})();