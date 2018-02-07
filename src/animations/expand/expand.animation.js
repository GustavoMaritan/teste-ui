(function() {
	'use strict';

	angular
		.module('smn-ui')
		.animation('.ui-expand', uiExpandAnimation);

	uiExpandAnimation.$inject = ['$animateCss'];

	function uiExpandAnimation($animateCss) {
		var animation = {
				addClass: addClass,
				removeClass: removeClass
			},
			lastId = 0,
			_cache = {};

		return animation;

		function getId(el) {
			var id = el[0].getAttribute('ui-expand-toggle');
			if (!id) {
				id = ++lastId;
				el[0].setAttribute('ui-expand-toggle', id);
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
						element[0].style.width = '';
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
					width = (state.animating && state.width) ? state.width : element[0].offsetWidth;

				var animator = $animateCss(element, {
					from: {
						height: height,
						width: width,
						opacity: 0
					},
					to: {
						height: 0,
						width: 0,
						opacity: 1
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
						state.width = width;
						state.height = width;
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
				var state = getState(getId(element)),
				    height = (state.animating && state.height) ? state.height : 0,
					width = (state.animating && state.width) ? state.width : 0;

				var animator = $animateCss(element, {
					from: {
						height: height,
						width: width
					},
					to: {
						height: element[0].scrollHeight + 'px',
						width: element[0].scrollWidth + 'px'
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
						state.width = width;
						state.height = height;
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