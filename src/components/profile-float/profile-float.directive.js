(function(){
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiProfileFloat', uiProfileFloat);

	uiProfileFloat.$inject = ['$templateCache', '$interval'];

	function uiProfileFloat($templateCache, $interval){
		var directive = {
			restrict: 'E',
			scope: {
				src: '='
			},
			transclude: true,
            templateUrl: 'components/profile-float/profile-float.directive.html',
			link: link
		};
		return directive;

		function link(scope, element){
			var loaded = false,
			    img = element.find('img'),
			    wait;
			scope.$watch('src', function(value){
				if (!value)
					return;
				wait = $interval(function(){
					if (loaded)
						$interval.cancel(wait);
					scope.higherWidth = !img[0] || img[0].naturalWidth > img[0].naturalHeight;
				},0);
			});
			img.on('load', function(e){
				scope.$apply(function(){
					loaded = true;
				});
			});
			img.on('error', function(e){
				scope.$apply(function(){
					loaded = true;
				});
			});
		}
	}
})();