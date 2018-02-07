(function() {
	'use strict';

	angular
		.module('smn-ui')
		.factory('uiWindow', uiWindow);

	uiWindow.$inject = ['$window', '$rootScope'];

	function uiWindow($window, $rootScope) {
		var service = {};

		angular.element($window).bind('scroll', function(){
			$rootScope.$apply(getWindowScroll);
		});

		angular.element($window).bind('resize', function(){
			$rootScope.$apply(getWindowScroll);
		});

		function getWindowScroll() {
			service.scrollX = $window.scrollX;
			service.scrollY = $window.scrollY;
			service.innerWidth = $window.innerWidth;
			service.innerHeight = $window.innerHeight;
		}

		getWindowScroll();

		return service;
	}
})();