(function(){
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiSlide', uiSlide);

	function uiSlide(){
		var directive = {
			restrict: 'AE',
			priority: 1,
			scope: {
				onActive: '&?',
				onInactive: '&?'
			},
			templateUrl: 'components/slider/slide.directive.html',
			transclude: true,
			require: '^uiSlider',
			link: link
		};

		return directive;

		function link(scope, element, attributes, uiSliderController){
			scope.index = null;
			scope.active = false;
			scope.ctrl = uiSliderController;
			scope.element = element;
			uiSliderController.addSlide(scope);
            scope.$on('$destroy', function () {
                uiSliderController.removeSlide(scope);
            })
		}
	}
})();