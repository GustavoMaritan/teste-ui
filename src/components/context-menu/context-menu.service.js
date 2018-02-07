(function() {
	'use strict';

	angular
		.module('smn-ui')
		.factory('uiContextMenu', uiContextMenu);

	uiContextMenu.$inject = ['$rootScope'];

	function uiContextMenu($rootScope) {
		var service = {
			closeAll: closeAll,
			eventBound: false
		};
		
		return service;

		function closeAll() {
			$rootScope.$broadcast('uiContextMenu.close');
		}
	}
})();