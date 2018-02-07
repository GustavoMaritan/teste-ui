(function(){
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiSlider', uiSlider);

	function uiSlider(){
		var directive = {
			restrict: 'E',
			templateUrl: 'components/slider/slider.directive.html',
			transclude: true,
			scope: {
				activeIndex: '='
			},
			controller: uiSliderController,
			controllerAs: 'vm',
			bindToController: true
		};

		return directive;
	}

	uiSliderController.$inject = ['$scope', '$element', '$compile', '$animate', '$animateCss', '$timeout'];

	function uiSliderController($scope, $element, $compile, $animate, $animateCss, $timeout) {
		var vm = this;
		vm.slides = [];
		vm.activeSlide = null;
		vm.addSlide = addSlide;
		vm.removeSlide = removeSlide;

		$scope.$watch('vm.activeIndex', function(value, oldValue){
			$timeout(function(){
				$animateCss($element, {
					from: { height: $element.outerHeight() },
					to: { height: $element.children('ui-slider-content').children().eq(value).children().outerHeight() }
				}).start().done(function(){
					$element[0].style.height = '';
				});
				value !== oldValue && activateElement(vm.slides[value]);
			});
		});

		function addSlide(slide){
			slide.index = vm.slides.length;
			vm.slides.push(slide);
			if (vm.activeIndex === (vm.slides.length - 1) || (!vm.activeIndex && vm.slides.length === 1))
				activateElement(slide);
			else
				deactivateElement(slide);
		}

        function removeSlide(scope) {
            vm.slides.splice(scope.index, 1);
            for (var i = scope.index; i < vm.slides.length; i++) {
                vm.slides[i].index = i;
            }
        }

		function activateElement(scope){
			if (!scope)
				return;
			vm.activeSlide && deactivateElement(vm.activeSlide);
			vm.activeSlide = scope;
			scope.element.removeClass('out-of-bound');
			$animate.addClass(scope.element, 'slide-active')
				.then(function(){
					scope.onActive && scope.onActive();
				});
		}

		function deactivateElement(scope){
			if (!scope)
				return;
			$animate.removeClass(scope.element, 'slide-active')
				.then(function(){
					scope.onInactive && scope.onInactive();
					scope.element.addClass('out-of-bound');
				});
		}
	}
})();