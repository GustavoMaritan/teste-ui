(function () {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiContextMenu', uiContextMenuDirective);

	uiContextMenuDirective.$inject = ['$timeout', '$templateCache', '$interpolate', '$compile', '$animateCss', 'uiContextMenu', 'uiWindow'];

	function uiContextMenuDirective($timeout, $templateCache, $interpolate, $compile, $animateCss, uiContextMenu, uiWindow) {
		var directive = {
			link: link,
			restrict: 'EA',
			require: '?ngModel'
		};
		return directive;

		function link(scope, element, attrs, model) {
			if (!uiContextMenu.eventBound) {
				document.addEventListener('mousedown', removeEvent);
				document.addEventListener('click', removeEvent);
				window.addEventListener('scroll', removeEvent);
				window.addEventListener('resize', removeEvent);
				window.addEventListener('blur', removeEvent);
				uiContextMenu.eventBound = true;
			}

			function removeEvent() {
				uiContextMenu.closeAll();
				scope.$apply();
			}

			function closeMenu() {
				if (scope.menu) {
					var target = scope.menu,
						position = scope.position,
						newPosition = scope.newPosition;
					scope.menu = null;
					scope.position = null;
					scope.newPosition = null;
					$animateCss(target, {
						from: {
							height: target.height(),
							width: target.width(),
							transform: $interpolate('translate({{x}}px, {{y}}px)')({
								x: newPosition.x,
								y: newPosition.y
							})
						},
						to: {
							height: 0,
							width: 0,
							transform: $interpolate('translate({{x}}px, {{y}}px)')({
								x: position.x,
								y: position.y
							})
						}
					}).start().then(function () {
						target.remove();
					});
				}
			}

			scope.$on('uiContextMenu.close', closeMenu);

			function getModel() {
				return model ? angular.extend(scope, model.$modelValue) : scope;
			}

			function render(event, strategy) {
				strategy = strategy || 'append';
				if ('preventDefault' in event) {
					uiContextMenu.closeAll();
					event.stopPropagation();
					event.preventDefault();
					scope.position = { x: event.clientX || element.offset().left, y: event.clientY || element.offset().top };
				} else if (!scope.menu)
					return;

				var compiled = $compile($templateCache.get(attrs.uiContextMenu))(angular.extend(getModel())),
					menu = angular.element(compiled);
				switch (strategy) {
					case 'append':
						angular.element('body').append(menu);
						scope.newPosition = {};

						if (scope.position.y + menu[0].offsetHeight + 10 > uiWindow.innerHeight)
							scope.newPosition.y = scope.position.y - ((scope.position.y + menu[0].offsetHeight + 10) - uiWindow.innerHeight);
						else
							scope.newPosition.y = scope.position.y;

						if (scope.position.x + menu[0].offsetWidth + 10 > uiWindow.innerWidth)
							scope.newPosition.x = scope.position.x - ((scope.position.x + menu[0].offsetWidth + 10) - uiWindow.innerWidth);
						else
							scope.newPosition.x = scope.position.x;

                        menu[0].style.display = 'none';
                        $timeout(function () {
                            menu[0].style.display = '';
                            $animateCss(menu, {
                                from: {
                                    height: 0,
                                    width: 0,
                                    transform: $interpolate('translate({{x}}px, {{y}}px)')({
                                        x: scope.position.x,
                                        y: scope.position.y
                                    })
                                },
                                to: {
                                    height: menu[0].offsetHeight,
                                    width: menu[0].offsetWidth,
                                    transform: $interpolate('translate({{x}}px, {{y}}px)')({
                                        x: scope.newPosition.x,
                                        y: scope.newPosition.y
                                    })
                                }
                            }).start().then(function () {
                                menu[0].style.width = menu[0].style.height = '';
                            });
                        })
						break;
					default:
						scope.menu.replaceWith(menu);
				}

				scope.menu = menu;
				scope.menu.bind('click', closeMenu);
				scope.menu.bind('mousedown', function (event) {
					event.stopPropagation();
					event.preventDefault();
				})
			}

			if (model) {
				var listener = function listener() {
					return model.$modelValue;
				};
				scope.$watch(listener, function () {
					render({}, 'replaceWith');
				}, true);
			}

			element.bind(attrs.uiContextEvent || 'contextmenu', render);
		}
	}
})();