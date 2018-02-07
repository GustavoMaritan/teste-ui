(function() {
	'use strict';

	angular
		.module('smn-ui')
		.animation('.ui-hamburger-icon', hamburgerAnimation);

	hamburgerAnimation.$inject = ['$animateCss', '$timeout'];

	function hamburgerAnimation($animateCss, $timeout) {
		return {
			addClass: function(element, className, doneFn) {
				if (className !== 'back')
					return;
				if (typeof element[0].addClassAnimationRunning === 'undefined')
					element[0].addClassAnimationRunning = 0;
				element[0].addClassAnimationRunning++;
				$animateCss(element, {
					to: {
						transform: 'rotate(180deg)'
					}
				}).start().done(function(){
					if (element.is('.half'))
						element.removeClass('half');
					else
						element.addClass('half');
					element[0].addClassAnimationRunning--;
					doneFn();
				});
			},
			removeClass: function(element, className, doneFn) {
				if (className !== 'back')
					return;
				if (typeof element[0].removeClassAnimationRunning === 'undefined')
					element[0].removeClassAnimationRunning = 0;
				element[0].removeClassAnimationRunning++;
				$animateCss(element, {
					to: {
						transform: 'rotate(' + (element[0].addClassAnimationRunning && (element[0].removeClassAnimationRunning % 2 !== 0) ? 0 : 360) + 'deg)'
					}
				}).start().done(function(){
					if (element.is('.half')) {
						element.removeClass('half');
						if (!element[0].addClassAnimationRunning) {
							element.css('transition', '0s');
							element.css('transform', '');
							$timeout(function() {
								element.css('transition', '');
							});
						}
					} else
						element.addClass('half');
					element[0].removeClassAnimationRunning--;
					doneFn();
				});
			}
		};
	}
})();