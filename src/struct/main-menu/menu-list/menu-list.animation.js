(function() {
	'use strict';

	angular
		.module('smn-ui')
		.animation('.drawer-slide-vertical', drawerSlideAnimation);

	drawerSlideAnimation.$inject = ['$animateCss'];

	function drawerSlideAnimation($animateCss) {
		var animation = {
				addClass: addClass,
				removeClass: removeClass
			},
			lastId = 0,
			_cache = {};

		return animation;

		function getId(el) {
			var id = el[0].getAttribute('drawer-slide-vertical-toggle');
			if (!id) {
				id = ++lastId;
				el[0].setAttribute('drawer-slide-vertical-toggle', id);
			}
			return id;
		}

		function getState(id) {
			var state = _cache[id];
			if (!state) {
				state = {};
				_cache[id] = state;
			}
			return state;
		}

		function generateRunner(closing, state, animator, element, doneFn) {
			return function() {
				state.animating = true;
				state.animator = animator;
				state.doneFn = doneFn;
				animator.start().finally(function() {
					// closing &&
					if (state.doneFn === doneFn) {
						element[0].style.height = '';
					// 	element[0].style.marginTop = '';
					// 	element[0].style.opacity = '';
					// 	element[0].style.overflow = '';
					}
					state.animating = false;
					state.animator = undefined;
					state.doneFn();
				});
			}
		}

		function addClass(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element)),
				    height = (state.animating && state.height) ? state.height : element[0].offsetHeight,
					marginTop = (state.animating && state.marginTop) ? state.marginTop : parseInt(element.css('margin-top')),
					opacity = (state.animating && state.opacity) ? state.opacity : parseInt(element.css('opacity')),
					keepOpacity = element.is('.keep-opacity');

				var animator = $animateCss(element, {
					from: {
						marginTop: marginTop + 'px',
						opacity: keepOpacity ? '' : opacity,
						height: height
					},
					to: {
						marginTop: -height + 'px',
						opacity: keepOpacity ? '' : 0,
						height: height
					}
				});
				if (animator) {
					if (state.animating) {
						state.doneFn =
						  generateRunner(true,
										 state,
										 animator,
										 element,
										 doneFn);
						return state.animator.end();
					} else {
						state.marginTop = marginTop;
						state.opacity = opacity;
						return generateRunner(true,
											  state,
											  animator,
											  element,
											  doneFn)();
					}
				}
			}
			doneFn();
		}

		function removeClass(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element));
				var height = element[0].offsetHeight,
					marginTop = (state.animating && state.marginTop) ? state.marginTop : parseInt(element.css('margin-top')),
					opacity = (state.animating && state.opacity) ? state.opacity : parseInt(element.css('opacity')),
					keepOpacity = element.is('.keep-opacity');

				var animator = $animateCss(element, {
					from: {
						marginTop: (marginTop || -height) + 'px',
						opacity: keepOpacity ? '' : opacity,
						height: height
					},
					to: {
						marginTop: '0px',
						opacity: keepOpacity ? '' : 1,
						height: height
					}
				});

				if (animator) {
					if (state.animating) {
						state.doneFn = generateRunner(false,
													  state,
													  animator,
													  element,
													  doneFn);
						return state.animator.end();
					} else {
						state.marginTop = marginTop;
						state.opacity = opacity;
						return generateRunner(false,
											  state,
											  animator,
											  element,
											  doneFn)();
					}
				}
			}
			doneFn();
		}
	}
})();