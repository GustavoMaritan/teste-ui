'use strict';

(function () {

    angular.module('smn-ui', ['ngMessages', 'ngAnimate']);
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiMenuList', uiMenuList);

	uiMenuList.$inject = ['$templateCache'];

	function uiMenuList($templateCache) {
		var directive = {
			require: '^uiMainMenu',
			link: link,
			restrict: 'E',
			template:'<ui-menu-item item="item" list="item[config.submenu]" level="level" is-open="isOpen" ng-class="{\'is-open\': isOpen}" ng-repeat="item in list"></ui-menu-item>',
			scope: {
				'list': '=',
				'parentLevel': '='
			}
		};
		return directive;

		function link(scope, element, attrs, ctrl) {
			scope.level = scope.parentLevel + 1;
			scope.config = ctrl.config;
		}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').animation('.drawer-slide-vertical', drawerSlideAnimation);

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
			return function () {
				state.animating = true;
				state.animator = animator;
				state.doneFn = doneFn;
				animator.start().finally(function () {
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
			};
		}

		function addClass(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element)),
				    height = state.animating && state.height ? state.height : element[0].offsetHeight,
				    marginTop = state.animating && state.marginTop ? state.marginTop : parseInt(element.css('margin-top')),
				    opacity = state.animating && state.opacity ? state.opacity : parseInt(element.css('opacity')),
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
						state.doneFn = generateRunner(true, state, animator, element, doneFn);
						return state.animator.end();
					} else {
						state.marginTop = marginTop;
						state.opacity = opacity;
						return generateRunner(true, state, animator, element, doneFn)();
					}
				}
			}
			doneFn();
		}

		function removeClass(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element));
				var height = element[0].offsetHeight,
				    marginTop = state.animating && state.marginTop ? state.marginTop : parseInt(element.css('margin-top')),
				    opacity = state.animating && state.opacity ? state.opacity : parseInt(element.css('opacity')),
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
						state.doneFn = generateRunner(false, state, animator, element, doneFn);
						return state.animator.end();
					} else {
						state.marginTop = marginTop;
						state.opacity = opacity;
						return generateRunner(false, state, animator, element, doneFn)();
					}
				}
			}
			doneFn();
		}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiMenuItem', uiMenuItem);

	uiMenuItem.$inject = ['$compile', '$templateCache'];

	function uiMenuItem($compile, $templateCache) {
		var directive = {
			require: '^uiMainMenu',
			link: link,
			restrict: 'E',
			template:'<div class="item-wrap"><a ng-href="{{item[config.href] || \'\'}}" ng-class="{\'has-submenu\': item[config.submenu]}" ng-click="item[config.submenu] ? openMenu() : (item[config.href] && menuClick())"><i class="material-icons option-icon" ng-class="{\'arrow-drop\': item[config.submenu]}" ng-if="item[config.submenu] || item[config.icon]">{{item[config.icon] || \'arrow_drop_down\'}}</i> {{item[config.name]}}</a><div ng-if="config.fav && item[config.href] && !item.denied"><i class="material-icons" ng-if="!item[config.fav.attr]" ng-click="config.fav.active(item)">{{config.fav.icon || \'favorite_border\'}}</i> <i class="material-icons" ng-if="item[config.fav.attr]" ng-click="config.fav.inative(item)" style="color:#E53935" ng-style="{color: config.fav.activeColor}">{{config.fav.iconActive || \'favorite\'}}</i></div></div>',
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
			scope.openMenu = function () {
				if (scope.item[scope.config.submenu]) scope.isOpen = !scope.isOpen;
			};
			scope.buttonOffset = scope.level != 1 ? 36 * (scope.level - 1) + 'px' : 0;
			if (scope.list) {
				$compile('<ui-menu-list class="drawer-slide-vertical" list="list" config="config" parent-level="level" ng-hide="!isOpen"></ui-menu-list>')(scope, function (cloned, scope) {
					element.append(cloned);
				});
			}
		}
	}
})();
'use strict';

(function () {
    'use strict';

    uiMaskPhonenumber.$inject = ["uiPhonenumberFilter", "$timeout"];
    angular.module('smn-ui').directive('uiMaskPhonenumber', uiMaskPhonenumber);

    function uiMaskPhonenumber(uiPhonenumberFilter, $timeout) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var beforeSelIndex, afterSelIndex, futureSelIndex;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
            });

            ctrl.$parsers.push(function (value) {
                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = uiPhonenumberFilter(value);
                ctrl.$setViewValue(uiPhonenumberFilter(viewValue));
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 4 && afterSelIndex == 5:
                            futureSelIndex = 6;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 9 || viewValue.length === 10) return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                return uiPhonenumberFilter(value);
            });

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                        caretPos = elem.selectionStart;
                    }

                return caretPos;
            }

            function setCaretPosition(elem, caretPos) {
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    } else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        } else {
                            elem.focus();
                        }
                    }
                }
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiPhonenumber', uiPhonenumber);

    function uiPhonenumber() {
        return uiPhonenumberFilter;

        function uiPhonenumberFilter(phonenumber) {
            if (!phonenumber) return '';
            phonenumber = phonenumber.toString().replace(/[^0-9]+/g, '');
            if (phonenumber.length > 4 && phonenumber.length < 9) phonenumber = phonenumber.substring(0, 4) + '-' + phonenumber.substring(4);else if (phonenumber.length > 8) phonenumber = phonenumber.substring(0, 5) + '-' + phonenumber.substring(5);
            if (phonenumber.length > 10) phonenumber = phonenumber.substring(0, 10);
            return phonenumber;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskPhone.$inject = ["uiPhoneFilter"];
    angular.module('smn-ui').directive('uiMaskPhone', uiMaskPhone);

    function uiMaskPhone(uiPhoneFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                var viewValue = uiPhoneFilter(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                if (viewValue.length === 14 || viewValue.length === 15) return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                return uiPhoneFilter(value);
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiPhone', uiPhone);

    function uiPhone() {
        return uiPhoneFilter;

        ////////////////

        function uiPhoneFilter(phone) {
            if (!phone) return;
            phone = phone.toString().replace(/[^0-9]+/g, '');
            if (phone.length > 0) phone = '(' + phone;
            if (phone.length > 3) phone = phone.substring(0, 3) + ') ' + phone.substring(3);
            if (phone.length > 9 && phone.length < 14) phone = phone.substring(0, 9) + '-' + phone.substring(9);else if (phone.length > 13) phone = phone.substring(0, 10) + '-' + phone.substring(10);
            if (phone.length > 15) phone = phone.substring(0, 15);
            return phone;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskPercentage.$inject = ["uiPercentageFilter"];
    angular.module('smn-ui').directive('uiMaskPercentage', uiMaskPercentage);

    function uiMaskPercentage(uiPercentageFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value, oldValue) {

                if (!value) return;

                var percentVal = +attrs.uiMaxPercentage;

                function adjustMaxPercentage(reg) {
                    if (value.match(reg) && value.match(/%/g)) percentVal += value.match(reg).length + value.match(/%/g).length - 1;
                }

                adjustMaxPercentage(/(-)|(,)/g);

                var viewValue = uiPercentageFilter(value.substring(0, percentVal));

                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionEnd >= viewValue.length) {
                    element[0].selectionEnd = viewValue.length - 1;
                    element[0].selectionStart = viewValue.length - 1;
                }

                element.bind("keyup", function (event) {
                    if ((event.which === 8 || event.which === 46) && element[0].value.includes('-%')) ctrl.$setViewValue('');
                });
                return parseFloat(viewValue.replace('%', '').replace(',', '.'));
            });
            ctrl.$formatters.push(function (value) {
                if (!value) return;
                var uiPF = uiPercentageFilter(value);
                return uiPF;
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiPercentage', uiPercentage);

    function uiPercentage() {
        return uiPercentageFilter;

        function uiPercentageFilter(percentage) {
            if (!percentage) return '';
            percentage = percentage.toString().replace('%', '');

            if (!percentage.includes('-') && percentage.match(/^\-?\d+(\,\d+)?\%?$/g) === null) percentage = percentage.substr(0, percentage.length - 1);

            if (percentage !== '') percentage += '%';

            if (!percentage || percentage == "%") return '';

            return percentage;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').service('uiCurrencyMaskUtils', uiCurrencyMaskUtils);

    function uiCurrencyMaskUtils() {
        var CurrencyMaskUtils;
        return CurrencyMaskUtils = function () {
            function CurrencyMaskUtils() {}

            CurrencyMaskUtils.clearSeparators = function (value) {
                if (value == null) {
                    return;
                }
                if (typeof value === 'number') {
                    value = value.toString();
                }
                return parseFloat(value.replace(/,/g, '.').replace(/\.(?![^.]*$)/g, ''));
            };

            CurrencyMaskUtils.toIntCents = function (value) {
                if (value != null) {
                    var fixedCents = Math.abs(parseInt(CurrencyMaskUtils.clearSeparators(value) * 100));
                    return fixedCents / 100;
                }
            };

            CurrencyMaskUtils.toFloatString = function (value) {
                if (value != null) {
                    return Math.abs(value).toFixed(2); // dentro do abs tava / 100
                }
            };

            return CurrencyMaskUtils;
        }();
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskCurrency.$inject = ["$timeout", "$locale", "uiCurrencyFilter"];
    angular.module('smn-ui').directive('uiMaskCurrency', uiMaskCurrency);

    function uiMaskCurrency($timeout, $locale, uiCurrencyFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
            var beforeSelIndex, afterSelIndex, futureSelIndex;
            var beforeViewValue, afterViewValue;
            var beforeModelValue;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
                beforeViewValue = ctrl.$viewValue;
                beforeModelValue = ctrl.$modelValue;
            });

            ctrl.$parsers.push(function (value) {
                var isDeletingZero = beforeViewValue == '0' + decimalSep + '00' && value.length < beforeViewValue.length;
                value = isDeletingZero ? '' : value;

                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = uiCurrencyFilter(value);
                afterViewValue = viewValue;

                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                var removeGroupSep = new RegExp('[^\\d\\' + decimalSep + ']+', 'g');
                var modelValue = viewValue.replace(removeGroupSep, '');
                modelValue = parseFloat(modelValue.replace(decimalSep, '.'));
                validateRange(modelValue);

                if (!viewValue && typeof viewValue != 'number') {
                    return null;
                }

                // Corrige o index do cursor de seleção
                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case afterViewValue.length - beforeViewValue.length == 2:
                            futureSelIndex = beforeSelIndex + 2;
                            break;
                        case !beforeViewValue || !modelValue:
                            futureSelIndex = afterViewValue.length;
                            break;
                        case beforeModelValue.toString().length === modelValue.toFixed(2).length && modelValue.toString().search(/e/) == -1:
                            // É verificado a existência de "e" na string pois se ela estourar o limite do Javascript o length não é confiável
                            futureSelIndex = beforeSelIndex;
                            break;
                        case value.length == 1:
                            futureSelIndex = viewValue.length;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }
                return modelValue;
            });

            ctrl.$formatters.push(function (value) {
                validateRange(value);
                return uiCurrencyFilter(value);
            });

            function validateRange(value) {
                ctrl.$setValidity('max', true);
                ctrl.$setValidity('min', true);
                ctrl.$setValidity('maxDigit', true);
                ctrl.$setValidity('minDigit', true);
                if (!value) return true;

                var valueLength = value.toString().replace(/[^\d]+/g, '').length;
                if (attrs.max) {
                    var max = parseFloat(attrs.max);
                    ctrl.$setValidity('max', value <= max);
                }
                if (attrs.min) {
                    var min = parseFloat(attrs.min);
                    ctrl.$setValidity('min', value >= min);
                }
                if (attrs.maxDigit) {
                    var maxDigit = parseInt(attrs.maxDigit);
                    ctrl.$setValidity('maxDigit', valueLength <= maxDigit);
                }
                if (attrs.minDigit) {
                    var minDigit = parseInt(attrs.minDigit);
                    ctrl.$setValidity('minDigit', valueLength >= minDigit);
                }
            }

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                        caretPos = elem.selectionStart;
                    }

                return caretPos;
            }

            function setCaretPosition(elem, caretPos) {
                elem.value = elem.value;
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    } else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        } else {
                            elem.focus();
                        }
                    }
                }
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiCurrency.$inject = ["$locale"];
    angular.module('smn-ui').filter('uiCurrency', uiCurrency);

    function uiCurrency($locale) {
        var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        var groupSep = $locale.NUMBER_FORMATS.GROUP_SEP;
        return uiCurrencyFilter;

        ////////////////

        function uiCurrencyFilter(currency) {
            if (!currency && typeof currency != 'number') {
                return '';
            }
            if (typeof currency == 'number') {
                currency = currency.toFixed(2);
            }

            // Removendo o que não é dígito qualquer zero adicional no começo da string
            currency = currency.toString().replace(/[^0-9]+/g, '').replace(/^0+/g, '');

            // Adiciona os zeros necessários à esquerda devido a formatação de dinheiro
            while (currency.length < 3) {
                currency = '0' + currency;
            }

            var newCurrency = '';
            currency = currency.split('');
            for (var i = 0; i < currency.length; i++) {
                var currencyChar = currency[currency.length - 1 - i];
                if (i === 2) {
                    newCurrency = decimalSep + newCurrency;
                } else if (i > 3 && !((i - 2) % 3)) {
                    newCurrency = groupSep + newCurrency;
                }
                newCurrency = currencyChar + newCurrency;
            }
            return newCurrency;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskCpf.$inject = ["uiCpfFilter"];
    angular.module('smn-ui').directive('uiMaskCpf', uiMaskCpf);

    function uiMaskCpf(uiCpfFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                var viewValue = uiCpfFilter(value);
                ctrl.$setValidity('cpf', isValidCpf(viewValue));
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                if (viewValue.length === 14) return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                value = typeof value == 'number' ? value.toString() : value;
                if (value) value = ("00000000000" + value).substring(11 + value.length - 11);
                return uiCpfFilter(value);
            });

            function isValidCpf(cpf) {
                if (!cpf) return true;

                if (cpf.length >= 14) {
                    var valid = true;

                    cpf = cpf.replace(/[^\d]+/g, '');

                    if (cpf.length != 11) valid = false;

                    var sum;
                    var rest;
                    sum = 0;
                    if (cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") valid = false;

                    for (var i = 1; i <= 9; i++) {
                        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
                    }rest = sum * 10 % 11;

                    if (rest == 10 || rest == 11) rest = 0;
                    if (rest != parseInt(cpf.substring(9, 10))) valid = false;

                    sum = 0;
                    for (var i = 1; i <= 10; i++) {
                        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
                    }rest = sum * 10 % 11;

                    if (rest == 10 || rest == 11) rest = 0;
                    if (rest != parseInt(cpf.substring(10, 11))) valid = false;

                    if (!valid) return false;
                }
                return true;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiCpf', uiCpf);

    function uiCpf() {
        return uiCpfFilter;

        function uiCpfFilter(cpf) {
            if (!cpf) return '';
            cpf = cpf.toString().replace(/[^0-9]+/g, '');
            if (cpf.length > 3) cpf = cpf.substring(0, 3) + '.' + cpf.substring(3);
            if (cpf.length > 7) cpf = cpf.substring(0, 7) + '.' + cpf.substring(7);
            if (cpf.length > 11) cpf = cpf.substring(0, 11) + '-' + cpf.substring(11);
            if (cpf.length > 14) cpf = cpf.substring(0, 14);
            return cpf;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskCnpj.$inject = ["uiCnpjFilter", "$timeout"];
    angular.module('smn-ui').directive('uiMaskCnpj', uiMaskCnpj);

    function uiMaskCnpj(uiCnpjFilter, $timeout) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var beforeSelIndex, afterSelIndex, futureSelIndex;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
            });

            ctrl.$parsers.push(function (value) {
                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = uiCnpjFilter(value);
                ctrl.$setValidity('cnpj', isValidCnpj(viewValue));
                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 2 && afterSelIndex == 3:
                            futureSelIndex = 4;
                            break;
                        case beforeSelIndex == 6 && afterSelIndex == 7:
                            futureSelIndex = 8;
                            break;
                        case beforeSelIndex == 10 && afterSelIndex == 11:
                            futureSelIndex = 12;
                            break;
                        case beforeSelIndex == 15 && afterSelIndex == 16:
                            futureSelIndex = 17;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 18) return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                value = typeof value == 'number' ? value.toString() : value;
                if (value) value = ("00000000000000" + value).substring(14 + value.length - 14);
                return uiCnpjFilter(value);
            });

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                        caretPos = elem.selectionStart;
                    }

                return caretPos;
            }

            function setCaretPosition(elem, caretPos) {
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    } else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        } else {
                            elem.focus();
                        }
                    }
                }
            }

            function isValidCnpj(cnpj) {
                if (!cnpj) return true;

                if (cnpj.length >= 18) {
                    var valid = true;
                    cnpj = cnpj.replace(/[^\d]+/g, '');

                    if (cnpj.length != 14) valid = false;

                    if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999") valid = false;

                    var size = cnpj.length - 2;
                    var numbers = cnpj.substring(0, size);
                    var digits = cnpj.substring(size);
                    var sum = 0;
                    var pos = size - 7;
                    for (var i = size; i >= 1; i--) {
                        sum += numbers.charAt(size - i) * pos--;
                        if (pos < 2) pos = 9;
                    }
                    var result = sum % 11 < 2 ? 0 : 11 - sum % 11;
                    if (result != digits.charAt(0)) valid = false;

                    size = size + 1;
                    numbers = cnpj.substring(0, size);
                    sum = 0;
                    pos = size - 7;
                    for (var i = size; i >= 1; i--) {
                        sum += numbers.charAt(size - i) * pos--;
                        if (pos < 2) pos = 9;
                    }
                    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
                    if (result != digits.charAt(1)) valid = false;

                    if (!valid) return false;
                }
                return true;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiCnpj', uiCnpj);

    function uiCnpj() {
        return uiCnpjFilter;

        ////////////////

        function uiCnpjFilter(cnpj) {
            if (!cnpj) return '';
            cnpj = cnpj.toString().replace(/[^0-9]+/g, '');
            if (cnpj.length > 2) cnpj = cnpj.substring(0, 2) + '.' + cnpj.substring(2);
            if (cnpj.length > 6) cnpj = cnpj.substring(0, 6) + '.' + cnpj.substring(6);
            if (cnpj.length > 10) cnpj = cnpj.substring(0, 10) + '/' + cnpj.substring(10);
            if (cnpj.length > 15) cnpj = cnpj.substring(0, 15) + '-' + cnpj.substring(15);
            if (cnpj.length > 18) cnpj = cnpj.substring(0, 18);
            return cnpj;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskCep.$inject = ["uiCepFilter", "$timeout"];
    angular.module('smn-ui').directive('uiMaskCep', uiMaskCep);

    function uiMaskCep(uiCepFilter, $timeout) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var beforeSelIndex, afterSelIndex, futureSelIndex;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
            });

            ctrl.$parsers.push(function (value) {
                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = uiCepFilter(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 5 && afterSelIndex == 6:
                            futureSelIndex = 7;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 9) return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                return uiCepFilter(value);
            });

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                        caretPos = elem.selectionStart;
                    }

                return caretPos;
            }

            function setCaretPosition(elem, caretPos) {
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    } else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        } else {
                            elem.focus();
                        }
                    }
                }
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiCep', uiCep);

    function uiCep() {
        return uiCepFilter;

        function uiCepFilter(cep) {
            if (!cep) return '';
            cep = cep.toString().replace(/[^0-9]+/g, '');
            if (cep.length > 5) cep = cep.substring(0, 5) + '-' + cep.substring(5);
            if (cep.length > 9) cep = cep.substring(0, 9);
            return cep;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiInputFile', uiInputFile);

    uiInputFile.$inject = ['$compile'];

    function uiInputFile($compile) {
        var directive = {
            require: 'ngModel',
            restrict: 'A',
            link: link,
            scope: {
                'ngModel': '=',
                'accept': '@?',
                'uiFileChange': '&',
                'uiMaxSize': '@?',
                'uiMaxFileSize': '@?',
                'uiValidExt': '@?',
                'uiRead': '&?',
                'uiError': '=?',
                'uiReadDataUrl': '=?'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (value) {
                if (!value) {
                    element.val('').trigger('change');
                    ctrl.$setValidity('uiMaxSize', true);
                    ctrl.$setValidity('uiMaxFileSize', true);
                    ctrl.$setValidity('uiAccept', true);
                }
            });
            ctrl.$parsers.push(function (value) {
                if (!value) element.val('').trigger('change');
            });

            element[0].addEventListener('change', handleFileSelect, false);
            function handleFileSelect(e) {
                e.stopPropagation();
                e.preventDefault();

                var files = e.target.files;
                scope.$apply(function () {
                    scope.uiReadDataUrl = 'uiReadDataUrl' in attrs && files.length ? [] : null;
                    ctrl.$setDirty();
                    ctrl.$setValidity('uiMaxSize', true);
                    ctrl.$setValidity('uiMaxFileSize', true);
                    ctrl.$setValidity('uiAccept', true);

                    // Verificação de tamanho
                    var maxSize = scope.uiMaxSize ? toByte(scope.uiMaxSize) : null,
                        maxFileSize = scope.uiMaxFileSize ? toByte(scope.uiMaxFileSize) : null,
                        accepts = scope.accept.split(',');
                    var sum = 0;
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i],
                            fileSize = file.size,
                            fileType = file.type,
                            validMaxFileSize = maxFileSize && fileSize > maxFileSize,
                            validMaxSize = maxSize && sum > maxSize,
                            fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);

                        if (validMaxFileSize) ctrl.$setValidity('uiMaxFileSize', false);
                        sum += fileSize;

                        // Verificar MIME Types
                        var validType = false;
                        for (var j = 0; j < accepts.length; j++) {
                            var accept = accepts[j].trim();
                            // Checa se tem apenas um asterisco
                            // e se ele está no final
                            var regex = accept.match(/^[^\*]*\*$/) ? new RegExp('^' + accept) : new RegExp('^' + accept + '$');
                            if (fileType.match(regex) || fileExtension.match(regex)) {
                                validType = true;
                                break;
                            }
                        }
                        if (!validType) ctrl.$setValidity('uiAccept', false);

                        if (maxSize && sum > maxSize) ctrl.$setValidity('uiMaxSize', false);

                        if (validType && !validMaxFileSize && !validMaxSize) {
                            scope.uiReadDataUrl.push({});
                            readFile(file, scope.uiReadDataUrl[i], i);
                        } else if (scope.uiError) {
                            scope.uiError(file, {
                                type: !validType,
                                maxSize: validMaxSize,
                                maxFileSize: validMaxFileSize
                            }, i);
                        }
                    }

                    scope.ngModel = e.target.files;

                    scope.uiFileChange({ '$files': scope.ngModel, '$error': ctrl.$invalid ? ctrl.$error : null });
                });
            }

            function toByte(sizeString) {
                sizeString = sizeString.toString();
                var unitMatch = sizeString.match(/[a-zA-Z]+/g),
                    unit = unitMatch ? unitMatch[0] : null,
                    sizeMatch = sizeString.match(/\d+/),
                    unitSize = sizeMatch ? parseInt(sizeMatch[0]) : null,
                    size = unitSize;
                switch (unit) {
                    case 'KB':
                        size = unitSize * 1024;
                        break;
                    case 'MB':
                        size = unitSize * Math.pow(1024, 2);
                        break;
                    case 'GB':
                        size = unitSize * Math.pow(1024, 3);
                        break;
                    case 'TB':
                        size = unitSize * Math.pow(1024, 4);
                        break;
                    case 'PB':
                        size = unitSize * Math.pow(1024, 5);
                        break;
                    case 'EB':
                        size = unitSize * Math.pow(1024, 6);
                        break;
                    case 'ZB':
                        size = unitSize * Math.pow(1024, 7);
                        break;
                    case 'YB':
                        size = unitSize * Math.pow(1024, 8);
                        break;
                }
                return size;
            }

            function readFile(file, data, index) {
                var reader = new FileReader();
                data.resolved = 'false';
                reader.onload = function (e) {
                    scope.$apply(function () {
                        data.result = e.target.result;
                        data.resolved = true;
                        scope.uiRead && scope.uiRead({ $data: data.result, $index: index, $file: file });
                    });
                };
                reader.onerror = function (e) {
                    scope.$apply(function () {
                        data.error = e.target.error;
                    });
                };
                reader.onprogress = function (e) {
                    if (!e.lengthComputable) return;
                    scope.$apply(function () {
                        data.progress = {
                            loaded: e.loaded,
                            total: e.total,
                            percent: Math.round(e.loaded / e.total * 100)
                        };
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiDatepicker.$inject = ["$compile", "$timeout", "$animate", "$interpolate"];
    angular.module('smn-ui').directive('uiDatepicker', uiDatepicker);

    function uiDatepicker($compile, $timeout, $animate, $interpolate) {
        var directive = {
            require: 'ngModel',
            link: link,
            restrict: 'A',
            scope: {
                ngModel: '=',
                uiDateFormat: '@?',
                uiDatepicker: '@?',
                uiSelect: '&?',
                uiMinDate: '=?',
                uiMaxDate: '=?',
                ngReadonly: '=?',
                uiViewDate: '=?'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var picker,
                mask,
                pickerGroup,
                fromEnter,
                toEnter,
                target = scope.uiDatepicker ? angular.element(scope.uiDatepicker) : element;

            element.on(attrs.uiPickerEvent || 'focus', function (e) {
                renderPicker(target);
            });

            scope.closePicker = closePicker;
            scope.select = select;

            function renderPicker(target) {
                pickerGroup = $compile('<ui-background-mask class="ui-picker-mask" ng-mousedown="closePicker($event)"></ui-background-mask>' + '<ui-calendar class="ui-picker" ' + 'tabindex="0" ' + 'ui-select="select($date)" ' + 'ui-cancel="closePicker()" ' + 'ui-view-date="uiViewDate" ' + 'ui-min-date="uiMinDate" ' + 'ui-max-date="uiMaxDate" ' + 'ui-view-date="ngModel" ' + ('uiInitOnSelected' in attrs ? 'ui-init-on-selected ' : '') + 'ng-model="ngModel"></ui-calendar>')(scope);
                var inputOffset = target.offset(),
                    padding = 16;

                angular.element('body').append(pickerGroup);
                mask = angular.element(pickerGroup[0]);
                picker = angular.element(pickerGroup[1]);

                $timeout(function () {
                    var pickerSize = {
                        height: picker[0].scrollHeight,
                        width: picker[0].clientWidth
                    };

                    var correctionMatrix = {
                        x: 0,
                        y: 0
                    };

                    var pickerHorizontalCoveringArea = inputOffset.left + picker[0].clientWidth + padding + (!scope.ngReadonly ? target[0].clientHeight : 0),
                        pickerVerticalCoveringArea = inputOffset.top + picker[0].clientHeight + padding + (!scope.ngReadonly ? target[0].clientHeight : 0);

                    if (pickerHorizontalCoveringArea > window.innerWidth + document.body.scrollTop) correctionMatrix.x = window.innerWidth + document.body.scrollTop - pickerHorizontalCoveringArea;
                    if (pickerVerticalCoveringArea > window.innerHeight + document.body.scrollTop) correctionMatrix.y = window.innerHeight + document.body.scrollTop - pickerVerticalCoveringArea;

                    fromEnter = {
                        top: inputOffset.top + (!scope.ngReadonly ? target[0].clientHeight : 0),
                        left: inputOffset.left,
                        opacity: 0,
                        transform: 'scale(0) translate(0px, 0px)'
                    };
                    toEnter = {
                        top: inputOffset.top + (!scope.ngReadonly ? target[0].clientHeight : 0),
                        left: inputOffset.left,
                        opacity: 1,
                        transform: 'scale(1) ' + $interpolate('translate({{x}}px, {{y}}px)')({ x: correctionMatrix.x, y: correctionMatrix.y })
                    };
                    $animate.enter(picker, document.body, angular.element('body > *:last-child'), {
                        from: fromEnter,
                        to: toEnter
                    }).then(function () {
                        picker.css({ height: '', width: '' });
                        picker.find('.label').focus();
                    });
                });

                var checkTimeout;
                picker.on('focus', 'button', function (e) {
                    $timeout.cancel(checkTimeout);
                });
                picker.on('mousedown click mouseup', function (e) {
                    $timeout.cancel(checkTimeout);
                });
                picker.on('keydown', function (e) {
                    if (e.keyCode === 27) scope.closePicker();
                });
                picker.on('focusout', 'button', function (e) {
                    checkTimeout = $timeout(function () {
                        scope.closePicker();
                        element.focus();
                    });
                });
            }

            function select($date) {
                scope.uiSelect && scope.uiSelect({ $date: $date });
                closePicker();
            };

            function closePicker(event) {
                $animate.leave(mask);
                toEnter.height = picker[0].scrollHeight;
                $animate.leave(picker, {
                    from: toEnter,
                    to: fromEnter
                }).then(function () {
                    element.focus();
                });
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            };
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiFilterBy', uiFilterBy);

    uiFilterBy.$inject = ['uiUnaccentFilter'];

    function uiFilterBy(uiUnaccentFilter) {
        return function (items, query, props, isCaseInsensitive) {
            isCaseInsensitive = typeof isCaseInsensitive === 'undefined' ? true : isCaseInsensitive;
            query = typeof query === 'string' ? query.toLowerCase() : query;
            query = isCaseInsensitive && query ? uiUnaccentFilter(query) : query;
            if (!items) return [];
            return items.filter(function (item) {
                if (!query) return true;
                for (var i = 0; i < props.length; i++) {
                    var value = '',
                        itemProps = props[i];
                    if (itemProps.props) {
                        for (var j = 0; j < itemProps.props.length; j++) {
                            var subProp = itemProps.props[j];
                            value += item[subProp] + (j < itemProps.props.length - 1 && itemProps.join ? itemProps.join : '');
                        }
                    } else value = item[props[i]];
                    value = isCaseInsensitive ? uiUnaccentFilter(value) : value;
                    if (value.toLowerCase().indexOf(query) != -1) return true;
                }
                return false;
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiTrigger', uiTrigger);

    function uiTrigger() {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                'uiTrigger': '@',
                'uiTriggerEvent': '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            element.bind(scope.uiTriggerEvent, function () {
                angular.element(scope.uiTrigger).trigger(scope.uiTriggerEvent);
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiAutofocus', uiAutofocus);

    uiAutofocus.$inject = ['$timeout'];

    /* @ngInject */
    function uiAutofocus($timeout) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            $timeout(function () {
                element[0].focus();
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiToolbar.$inject = ["$timeout"];
    angular.module('smn-ui').factory('uiToolbar', uiToolbar);

    function uiToolbar($timeout) {
        var toolbarTitle,
            flatModeDefaults = {
            active: false,
            breakPoint: '',
            size: ''
        },
            service = {
            getTitle: getTitle,
            setTitle: setTitle,
            clearTitle: clearTitle,
            flatMode: flatModeDefaults,
            resetFlatMode: resetFlatMode
        };
        return service;

        ////////////////

        function getTitle() {
            return toolbarTitle;
        }

        function setTitle(title) {
            toolbarTitle = undefined;
            $timeout(function () {
                toolbarTitle = title;
            });
        }

        function clearTitle() {
            toolbarTitle = undefined;
        }

        function resetFlatMode() {
            service.flatMode = angular.copy(flatModeDefaults);
        }
    }
})();
"use strict";
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiMainMenu', uiMainMenu);

    uiMainMenu.$inject = ['$templateCache'];

    function uiMainMenu($templateCache) {
        var directive = {
            restrict: 'E',
            template:'<ui-menu-list class="drawer-slide" list="vm.menuList" parent-level="vm.level"></ui-menu-list>',
            scope: {
                'menuList': '=',
                'config': '=?',
                'menuClick': '&?'
            },
            bindToController: true,
            controller: uiMainMenuController,
            controllerAs: 'vm'
        };
        return directive;
    }

    uiMainMenuController.$inject = ['$scope'];

    function uiMainMenuController($scope) {

        var vm = this;
        vm.level = 0;

        if (vm.config) {
            if (!vm.config.submenu) vm.config.submenu = 'submenu';
            if (!vm.config.favorite) vm.config.favorite = 'favorite';
            if (!vm.config.name) vm.config.name = 'name';
            if (!vm.config.icon) vm.config.icon = 'icon';
            if (!vm.config.href) vm.config.href = 'href';
        }
    }
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').animation('.ui-hamburger-icon', hamburgerAnimation);

	hamburgerAnimation.$inject = ['$animateCss', '$timeout'];

	function hamburgerAnimation($animateCss, $timeout) {
		return {
			addClass: function addClass(element, className, doneFn) {
				if (className !== 'back') return;
				if (typeof element[0].addClassAnimationRunning === 'undefined') element[0].addClassAnimationRunning = 0;
				element[0].addClassAnimationRunning++;
				$animateCss(element, {
					to: {
						transform: 'rotate(180deg)'
					}
				}).start().done(function () {
					if (element.is('.half')) element.removeClass('half');else element.addClass('half');
					element[0].addClassAnimationRunning--;
					doneFn();
				});
			},
			removeClass: function removeClass(element, className, doneFn) {
				if (className !== 'back') return;
				if (typeof element[0].removeClassAnimationRunning === 'undefined') element[0].removeClassAnimationRunning = 0;
				element[0].removeClassAnimationRunning++;
				$animateCss(element, {
					to: {
						transform: 'rotate(' + (element[0].addClassAnimationRunning && element[0].removeClassAnimationRunning % 2 !== 0 ? 0 : 360) + 'deg)'
					}
				}).start().done(function () {
					if (element.is('.half')) {
						element.removeClass('half');
						if (!element[0].addClassAnimationRunning) {
							element.css('transition', '0s');
							element.css('transform', '');
							$timeout(function () {
								element.css('transition', '');
							});
						}
					} else element.addClass('half');
					element[0].removeClassAnimationRunning--;
					doneFn();
				});
			}
		};
	}
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiMinute', uiMinute);

    function uiMinute() {
        return uiMinuteFilter;

        ////////////////

        function uiMinuteFilter(value) {
            if (value === undefined || value === null) return null;

            value = value.toString().substring(0, 2).replace(/\D+/g, '');
            value = value ? parseInt(value) : null;
            return value;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMinute.$inject = ["uiMinuteFilter"];
    angular.module('smn-ui').directive('uiMinute', uiMinute);

    function uiMinute(uiMinuteFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                var viewValue = formatValue(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                viewValue = /^([0-9]|[1-4][0-9]|5[0-9])$/.test(viewValue) ? viewValue : undefined;
                return viewValue;
            });
            ctrl.$formatters.push(formatValue);

            function formatValue(value) {
                return uiMinuteFilter(value);
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiMaxlength', uiMaxLength);

    function uiMaxLength() {
        var directive = {
            restrict: 'A',
            link: link,
            require: ['ngModel', '?^form'],
            scope: {
                uiMaxlength: '='
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            scope.$watch('uiMaxlength', function (value, oldValue) {
                element.attr('maxlength', value);
            });
            // ctrl[0].$formatters.unshift(formatValue);
            // ctrl[0].$parsers.unshift(formatValue);
            function formatValue(value) {
                if (!value || !scope.uiMaxLength) return value;
                var newValue = value.toString();
                var maxLength = parseInt(scope.uiMaxLength);
                if (isNaN(maxLength)) return;
                newValue = newValue.substring(0, maxLength);
                var isModelPristine = ctrl[0].$pristine,
                    isFormPristine = ctrl[1] ? ctrl[1].$pristine : false;
                ctrl[0].$setViewValue(newValue);
                ctrl[0].$render();
                isModelPristine && ctrl[0].$setPristine();
                isFormPristine && ctrl[1].$setPristine();
                return newValue;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiMaskDate.$inject = ["$filter", "$timeout"];
    angular.module('smn-ui').directive('uiMaskDate', uiMaskDate);

    function uiMaskDate($filter, $timeout) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel',
            scope: {
                uiMaxDate: '=',
                uiMinDate: '='
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var beforeSelIndex, afterSelIndex, futureSelIndex;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
            });

            ctrl.$parsers.push(function (value) {
                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = formatDate(ctrl.$viewValue);
                var check = checkDate(viewValue);

                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 2 && afterSelIndex == 3:
                            futureSelIndex = 4;
                            break;
                        case beforeSelIndex == 5 && afterSelIndex == 6:
                            futureSelIndex = 7;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 10 && check) {
                    var dateArray = viewValue.split('/');

                    ctrl.$setValidity('max', !(scope.uiMaxDate && scope.uiMaxDate < check));
                    ctrl.$setValidity('min', !(scope.uiMinDate && scope.uiMinDate > check));

                    return new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
                }

                if (!viewValue) return '';
            });

            ctrl.$formatters.push(function (value) {
                return $filter('date')(value, 'dd/MM/yyyy');
            });

            scope.$watch('uiMaxDate', function () {
                var viewValue = formatDate(ctrl.$viewValue);
                var check = checkDate(viewValue);

                ctrl.$setValidity('max', true);
                if (check && scope.uiMinDate) ctrl.$setValidity('max', !(scope.uiMaxDate < check));
            });

            scope.$watch('uiMinDate', function () {
                var viewValue = formatDate(ctrl.$viewValue);
                var check = checkDate(viewValue);

                ctrl.$setValidity('min', true);
                if (check && scope.uiMinDate) ctrl.$setValidity('min', scope.uiMinDate <= check);
            });

            function formatDate(date) {
                if (!date) return '';
                date = date.replace(/[^0-9]+/g, '');
                if (date.length > 2) date = date.substring(0, 2) + '/' + date.substring(2);
                if (date.length > 5) date = date.substring(0, 5) + '/' + date.substring(5, 9);
                return date;
            }

            function checkDate(value) {
                if (!/^[\d, \/]+$/.test(value)) return false;
                var splittedDate = value.split('/');
                if (splittedDate.length !== 3) return false;

                var date = splittedDate[0],
                    month = splittedDate[1],
                    year = splittedDate[2];
                if (!date || !month || !year || month < 1 || month > 12) {
                    return false;
                }
                var dateCheck = new Date(year, month, 0).getDate();
                if (date > dateCheck || date < 1) {
                    return false;
                }
                var validDate = new Date(year, month - 1, date);
                return validDate;
            }

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                        caretPos = elem.selectionStart;
                    }

                return caretPos;
            }

            function setCaretPosition(elem, caretPos) {
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    } else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        } else {
                            elem.focus();
                        }
                    }
                }
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiInteger', uiInteger);

    function uiInteger() {
        return uiIntegerFilter;

        ////////////////

        function uiIntegerFilter(value) {
            if (value === undefined || value === null) return null;
            value = value.toString().replace(/\D+/g, '');
            value = value ? parseInt(value) : null;
            return value;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiInteger', uiInteger);

    uiInteger.$inject = ['uiIntegerFilter'];

    function uiInteger(uiIntegerFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel',
            scope: {
                uiIntegerDigitMax: '=?'
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                var viewValue = formatValue(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                return viewValue;
            });
            ctrl.$formatters.push(formatValue);
            function formatValue(value) {
                var newValue = uiIntegerFilter(value);
                if (scope.uiIntegerDigitMax && typeof newValue === 'number') {
                    var maxDigit = parseInt(scope.uiIntegerDigitMax);
                    if (!isNaN(maxDigit)) {
                        newValue = parseInt(newValue.toString().substring(0, maxDigit));
                    }
                }
                return newValue;
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiHour', uiHour);

    function uiHour() {
        return uiHourFilter;

        ////////////////

        function uiHourFilter(value) {
            if (value === undefined || value === null) return null;

            value = value.toString().substring(0, 2).replace(/\D+/g, '');
            value = value ? parseInt(value) : null;
            return value;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiHour.$inject = ["uiHourFilter"];
    angular.module('smn-ui').directive('uiHour', uiHour);

    function uiHour(uiHourFilter) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                var viewValue = formatValue(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();
                viewValue = /^([0-9]|1[0-9]|2[0-3])$/.test(viewValue) ? viewValue : undefined;
                return viewValue;
            });
            ctrl.$formatters.push(formatValue);

            function formatValue(value) {
                return uiHourFilter(value);
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiDateFormat.$inject = ["$locale", "$filter"];
    angular.module('smn-ui').directive('uiDateFormat', uiDateFormat);

    function uiDateFormat($locale, $filter) {
        var directive = {
            require: '?ngModel',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            if (!ctrl) return;
            ctrl.$formatters.push(function (value) {
                value = $filter('date')(value, getDateMask());
                ctrl.$modelValue = value;
                return value;
            });
            ctrl.$parsers.push(function (value) {
                if (!value) return null;
                var validDate = checkDate(value);
                if (validDate) {
                    ctrl.$setValidity('date', true);
                    return validDate;
                }
                ctrl.$setValidity('date', false);
                return null;
            });

            function getDateMask() {
                var mask = attrs.uiDateFormat || 'shortDate',
                    formats = $locale.DATETIME_FORMATS;
                var dateMask = mask in formats ? formats[mask] : mask;
                return dateMask;
            }

            function checkDate(value) {
                if (!/^[\d, \/]+$/.test(value)) return false;
                var splittedDate = value.split('/');
                if (splittedDate.length !== 3) return false;
                var dayIndex, monthIndex, yearIndex;

                var mask = getDateMask();
                mask = mask.split('/');
                for (var i = 0; i < 3; i++) {
                    if (mask[i].indexOf('d') > -1) dayIndex = i;
                    if (mask[i].indexOf('M') > -1) monthIndex = i;
                    if (mask[i].indexOf('y') > -1) yearIndex = i;
                }

                if (isNaN(dayIndex) || isNaN(monthIndex) || isNaN(yearIndex)) return false;

                var date = splittedDate[dayIndex],
                    month = splittedDate[monthIndex],
                    year = splittedDate[yearIndex];
                if (!date || !month || !year) return false;
                if (month < 1 || month > 12) {
                    return false;
                }
                var dateCheck = new Date(year, month, 0).getDate();
                if (date > dateCheck || date < 1) return false;
                var validDate = new Date(year, month - 1, date);
                return validDate;
            }
        }
    }
})();
'use strict';

(function () {
  'use strict';

  angular.module('smn-ui').component('uiSwitch', {
    controller: uiSwitchController
  });

  uiSwitchController.$inject = ['$element'];

  function uiSwitchController($element) {
    var $ctrl = this;
    $ctrl.$postLink = function () {
      $element.wrapInner('<label></label>');
      $element.find('input').addClass('ui-switch').after('<div class="switch-cover"><div class="track"></div><div class="thumb-container"><div class="thumb"></div></div></div>');
    };
  }
})();
'use strict';

(function () {
  'use strict';

  angular.module('smn-ui').component('uiOption', {
    controller: uiOptionController
  });

  uiOptionController.$inject = ['$element'];

  function uiOptionController($element) {
    var $ctrl = this;
    $ctrl.$postLink = function () {
      $element.wrapInner('<label></label>');
      $element.find('input').addClass('ui-option').after('<div class="ui-option-shell"><div class="ui-option-fill"></div><div class="ui-option-mark"></div></div>');
    };
  }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').component('uiInputContainer', {
        controller: uiInputContainerController,
        require: '?ngModel',
        bindings: {
            'ngModel': '=?'
        }
    });

    uiInputContainerController.$inject = ['$element'];
    function uiInputContainerController($element) {
        var $ctrl = this;

        $ctrl.$postLink = function () {
            $element.children('select, input, textarea, ui-chips').addClass('ui-control').after('<div class="line"></div>');
        };
    }
})();
'use strict';

(function () {
    'use strict';

    uiChipsController.$inject = ["$element", "$timeout"];
    angular.module('smn-ui').component('uiChips', {
        controller: uiChipsController,
        require: {
            ngModelCtrl: 'ngModel'
        },
        template:'<ui-chip ng-repeat="$chip in $ctrl.ngModel" ng-keydown="$ctrl.chipKeyAction($event, $index)"></ui-chip><input type="text" ng-model="$ctrl.searchQuery" ng-focus="$ctrl.showItems()" ng-blur="$ctrl.hideItems()" ng-change="$ctrl.checkFilteredItems($ctrl.uiItemsFiltered)" ng-keydown="$ctrl.inputKeyAction($event)" ng-attr-placeholder="{{($ctrl.ngModel.length ? $ctrl.secondaryPlaceholder : \'\') || $ctrl.placeholder }}"><ui-card class="ui-chip-autocomplete" ng-if="$ctrl.uiItems && $ctrl.itemsShown" tabindex="-1" ng-focus="$ctrl.showItems()" ng-blur="$ctrl.hideItems()" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1;"><ul class="ui-list s-l1 s-dense clickable"><li ng-repeat="item in $ctrl.uiItemsFiltered = ($ctrl.uiItems | uiFilterBy:$ctrl.searchQuery:[$ctrl.uiPrimaryInfo] | filter:$ctrl.filterRemoveSelected | limitTo: $ctrl.uiLimit) track by (ctrl.uiTrackBy || $index)"><div class="item-cover blue" ng-click="$ctrl.selectItem(item)" ng-class="{\'focused\': $ctrl.focusedIndex === $index}"><div class="list-text" ng-bind="$ctrl.uiPrimaryInfo ? item[$ctrl.uiPrimaryInfo] : item"></div></div></li></ul></ui-card>',
        bindings: {
            'ngModel': '=',
            'uiItems': '=',
            'required': '=',
            'uiItemsValue': '@',
            'uiPrimaryInfo': '@',
            'chipTemplateUrl': '@',
            'uiItemsAllowCustom': '@',
            'changeFunction': '=?',
            'uiTrackBy': '@',
            'uiSearchQuery': '=searchQuery',
            'placeholder': '@',
            'secondaryPlaceholder': '@',
            'uiLimit': '=',
            'min': '=',
            'max': '=',
            'name': '@'
        }
    });

    function uiChipsController($element, $timeout) {
        var $ctrl = this;
        $ctrl.ngModel = $ctrl.ngModel || [];
        $ctrl.uiItemsFiltered = [];
        $ctrl.focusedIndex = 0;
        $ctrl.$onInit = function () {
            $element.attr('tabindex', -1);
            $element.bind('click', function (e) {
                if (angular.element(e.target).is('ui-chips')) $element.find('input').focus();
            });
            $element.on('focus', '> *', function (e) {
                $element.addClass('ui-focused');
            });
            $element.on('blur', '> *', function (e) {
                $element.removeClass('ui-focused');
            });
            $ctrl.ngModelCtrl.$validators.min = isMinValid;
        };

        function isMinValid(value) {
            return !angular.isNumber($ctrl.min) || value.length >= $ctrl.min;
        }

        function isMaxValid(value) {
            return !angular.isNumber($ctrl.max) || value.length <= $ctrl.max;
        }

        $ctrl.chipKeyAction = function (event, index) {
            if ([8, 46].indexOf(event.which) > -1) {
                $ctrl.removeChip(index);
                var focusIndex = !$ctrl.ngModel.length ? 1 : index === $ctrl.ngModel.length ? index - 1 : index + 1;
                $element.children().eq(focusIndex).focus();
            }
        };

        $ctrl.inputKeyAction = function (event) {
            switch (event.which) {
                case 8:
                case 37:
                    if ($ctrl.ngModel && !$ctrl.searchQuery) $element.children('input').prev().focus();
                    break;
                case 38:
                    $ctrl.focusedIndex = !$ctrl.uiItemsFiltered.length ? null : $ctrl.focusedIndex ? $ctrl.focusedIndex - 1 : $ctrl.uiItemsFiltered.length - 1;
                    break;
                case 40:
                    $ctrl.focusedIndex = !$ctrl.uiItemsFiltered.length ? null : $ctrl.uiItemsFiltered.length - 1 === $ctrl.focusedIndex ? 0 : $ctrl.focusedIndex + 1;
                    break;
                case 13:
                    if ($ctrl.searchQuery && !$ctrl.uiItems) {
                        $ctrl.ngModel.indexOf($ctrl.searchQuery) === -1 && $ctrl.ngModel.push(angular.copy($ctrl.searchQuery));
                        $ctrl.searchQuery = '';
                    } else if ($ctrl.uiItemsFiltered) {
                        if (typeof $ctrl.focusedIndex === 'number') $ctrl.selectItem($ctrl.uiItemsFiltered[$ctrl.focusedIndex]);
                    }
                    event.preventDefault();
                    break;
            }
        };

        var hideTimeout;
        $ctrl.itemsShown = false;
        $ctrl.showItems = function () {
            $timeout.cancel(hideTimeout);
            $ctrl.itemsShown = true;
            $timeout(function () {
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            });
        };
        $ctrl.hideItems = function () {
            hideTimeout = $timeout(function () {
                $ctrl.itemsShown = false;
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            });
        };
        $ctrl.filterRemoveSelected = function (item) {
            if ($ctrl.uiTrackBy) {
                for (var i = 0; i < $ctrl.ngModel.length; i++) {
                    if ($ctrl.ngModel[i][$ctrl.uiTrackBy] === item[$ctrl.uiTrackBy]) return false;
                }
                return true;
            }
            return $ctrl.uiItemsValue ? $ctrl.ngModel.indexOf(item[$ctrl.uiItemsValue]) === -1 : item;
        };
        $ctrl.checkFilteredItems = function () {
            $timeout(function () {
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? $ctrl.focusedIndex || 0 : null;
            });
        };
        $ctrl.selectItem = function (item) {
            $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            $ctrl.ngModel.push($ctrl.uiItemsValue ? item[$ctrl.uiItemsValue] : item);
            $ctrl.ngModelCtrl.$modelValue = $ctrl.ngModel;
            $ctrl.changeFunction && $ctrl.changeFunction(item);
            $element.find('input').focus();
            $ctrl.searchQuery = '';
            $ctrl.ngModelCtrl.$setDirty();
            $ctrl.ngModelCtrl.$setValidity('min', isMinValid($ctrl.ngModel));
            $ctrl.ngModelCtrl.$setValidity('max', isMaxValid($ctrl.ngModel));
        };
        $ctrl.removeChip = function (index) {
            if ($ctrl.ngModel.constructor !== Array) return;
            $ctrl.ngModel.splice(index, 1);
            $ctrl.changeFunction && $ctrl.changeFunction();
            $ctrl.ngModelCtrl.$setDirty();
            $ctrl.ngModelCtrl.$setValidity('min', isMinValid($ctrl.ngModel));
            $ctrl.ngModelCtrl.$setValidity('max', isMaxValid($ctrl.ngModel));
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiChip', uiChip);

    uiChip.$inject = ['$timeout'];

    /* @ngInject */
    function uiChip($timeout) {
        var directive = {
            require: '^^uiChips',
            template:'<span ng-if="!ctrl.chipTemplateUrl" ng-bind="ctrl.uiItemsValue ? (ctrl.uiItems | filter:{ idUnidade: $chip })[0][ctrl.uiPrimaryInfo] || $chip : (ctrl.uiPrimaryInfo ? $chip[ctrl.uiPrimaryInfo] : $chip)"></span> <button type="button" ng-click="ctrl.removeChip($index)" class="remove-chip" tabindex="-1"><i class="material-icons">clear</i></button><chip-template ng-if="ctrl.chipTemplateUrl" ng-include="ctrl.chipTemplateUrl"></chip-template>',
            link: link,
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            scope.ctrl = ctrl;
            element.attr('tabindex', -1);
            element.bind('keydown', function (e) {
                switch (e.keyCode) {
                    case 37:
                        var target = element.is(':first-child') ? element.siblings(':last-child') : element.prev();
                        target.focus();
                        break;
                    case 39:
                        element.next().focus();
                        break;
                }
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    uiAutocompleteController.$inject = ["$element", "$timeout"];
    angular.module('smn-ui').component('uiAutocomplete', {
        controller: uiAutocompleteController,
        require: {
            ngModelCtrl: 'ngModel'
        },
        template:'<ui-input-container><input type="text" ng-model="$ctrl.searchQuery" ng-focus="$ctrl.blur($ctrl.searchQuery); $ctrl.uiFocus()" ng-blur="$ctrl.hideItems(); $ctrl.uiBlur()" ng-change="$ctrl.searchItem($ctrl.searchQuery); $ctrl.uiChange()" ng-keydown="$ctrl.inputKeyAction($event)" ng-disabled="$ctrl.uiDisabled" ng-attr-placeholder="{{$ctrl.placeholder}}"> <label class="keep-float" ng-bind="$ctrl.uiLabel"></label></ui-input-container><ui-card class="ui-autocomplete-suggestions" ng-if="$ctrl.uiItems && $ctrl.itemsShown" tabindex="-1" ng-focus="$ctrl.showItems()" ng-blur="$ctrl.hideItems()"><ul class="ui-list s-l1 s-dense"><li class="clickable" ng-repeat="item in $ctrl.uiItemsFiltered = $ctrl.uiItems track by (ctrl.uiTrackBy || $index)"><div class="item-cover blue" ng-click="$ctrl.selectItem(item)" ng-class="{\'focused\': $ctrl.focusedIndex === $index}"><div class="list-text"><span ng-bind="$ctrl.uiPrimaryInfo ? item[$ctrl.uiPrimaryInfo] : item"></span><div class="ui-secondary" ng-if="$ctrl.uiSecondaryInfo" ng-bind="$ctrl.uiSecondaryInfo ? item[$ctrl.uiSecondaryInfo] : item"></div></div></div></li><li ng-if="!$ctrl.uiItems.length"><div class="item-cover"><div class="list-text ui-ellipsis">Nenhum resultado encontrado para "{{$ctrl.searchQuery}}"</div></div></li></ul></ui-card>',
        bindings: {
            'ngModel': '=',
            'uiItems': '=',
            'required': '=',
            'uiDisabled': '=',
            'uiItemsValue': '@',
            'uiPrimaryInfo': '@',
            'uiSecondaryInfo': '@',
            'uiLabel': '@',
            'uiTrackBy': '@',
            'searchQuery': '=uiSearchQuery',
            'searchFunction': '=uiSearchFunction',
            'selectFunction': '=uiSelectFunction',
            'uiFocus': '&',
            'uiBlur': '&',
            'uiChange': '&',
            'placeholder': '@',
            'name': '@'
        }
    });

    function uiAutocompleteController($element, $timeout) {
        var $ctrl = this;
        $ctrl.ngModel = $ctrl.ngModel || [];
        $ctrl.uiItemsFiltered = [];
        $ctrl.focusedIndex = 0;
        $ctrl.$onInit = function () {

            $element.attr('tabindex', -1);
            $element.bind('click', function (e) {
                if (angular.element(e.target).is('ui-autocomplete')) $element.find('input').focus();
            });
            $element.on('focus', '> *', function (e) {
                $element.addClass('ui-focused');
            });
            $element.on('blur', '> *', function (e) {
                $element.removeClass('ui-focused');
            });
        };

        $ctrl.inputKeyAction = function (event) {
            switch (event.which) {
                case 8:
                case 37:
                    if ($ctrl.ngModel && !$ctrl.searchQuery) $element.children('input').prev().focus();
                    break;
                case 38:
                    $ctrl.focusedIndex = !$ctrl.uiItemsFiltered.length ? null : $ctrl.focusedIndex ? $ctrl.focusedIndex - 1 : $ctrl.uiItemsFiltered.length - 1;
                    break;
                case 40:
                    $ctrl.focusedIndex = !$ctrl.uiItemsFiltered.length ? null : $ctrl.uiItemsFiltered.length - 1 === $ctrl.focusedIndex ? 0 : $ctrl.focusedIndex + 1;
                    break;
                case 13:
                    if ($ctrl.searchQuery && !$ctrl.uiItems) {
                        $ctrl.searchQuery = '';
                    } else if ($ctrl.uiItemsFiltered) {
                        if (typeof $ctrl.focusedIndex === 'number') $ctrl.selectItem($ctrl.uiItemsFiltered[$ctrl.focusedIndex]);
                    }
                    event.preventDefault();
                    break;
            }
        };

        var hideTimeout;
        var searchTimeout;
        $ctrl.itemsShown = false;
        $ctrl.showItems = function () {
            $timeout.cancel(hideTimeout);
            $ctrl.itemsShown = true;
            $timeout(function () {
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            });
        };
        $ctrl.hideItems = function () {
            hideTimeout = $timeout(function () {
                $ctrl.itemsShown = false;
                $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            });
        };
        $ctrl.blur = function (query) {
            $ctrl.searchFunction(query);
            $ctrl.showItems();
        };

        $ctrl.searchItem = function (query) {
            $ctrl.searchQuery = query;
            $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(function () {
                $ctrl.searchFunction(query);
                $ctrl.showItems();
            }, 300);
        };

        $ctrl.selectItem = function (item) {
            $ctrl.focusedIndex = $ctrl.uiItemsFiltered.length ? 0 : null;
            $ctrl.ngModel = $ctrl.uiItemsValue ? item[$ctrl.uiItemsValue] : item;
            $ctrl.ngModelCtrl.$modelValue = $ctrl.ngModel;
            $ctrl.ngModelCtrl.$setDirty();
            $element.find('input').focus();
            $ctrl.selectFunction && $ctrl.selectFunction(item);
            $timeout(function () {
                $ctrl.searchQuery = $ctrl.ngModel[$ctrl.uiPrimaryInfo];
                $ctrl.hideItems();
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiUnaccent', uiUnaccent);

    function uiUnaccent() {
        return function (strAccents) {
            if (!strAccents) return '';
            var strAccents = strAccents.split('');
            var strAccentsOut = [];
            var strAccentsLen = strAccents.length;
            var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
            for (var y = 0; y < strAccentsLen; y++) {
                if (accents.indexOf(strAccents[y]) != -1) {
                    strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
                } else strAccentsOut[y] = strAccents[y];
            }
            strAccentsOut = strAccentsOut.join('');
            return strAccentsOut;
        };
    }
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').filter('uiStringDate', uiFullDate);

	function uiFullDate() {
		return uiFullDateFilter;
	}
	function uiFullDateFilter(date) {
		var today = new Date(),
		    yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
		    months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		    weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
		    sevenDaysInMil = 1000 * 60 * 60 * 24 * 7;
		today.setHours(0, 0, 0, 0);
		yesterday.setHours(0, 0, 0, 0);
		date = new Date(date);
		date.setHours(0, 0, 0, 0);
		switch (true) {
			case today.getTime() === date.getTime():
				date = 'Hoje';
				break;
			case yesterday.getTime() === date.getTime():
				date = 'Ontem';
				break;
			case today.getTime() - sevenDaysInMil <= date.getTime():
				date = weekDays[date.getDay()];
				break;
			default:
				date = date.getDate() + ' de ' + months[date.getMonth()].toLowerCase() + ' de ' + date.getFullYear();
				break;
		}
		return date;
	}
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').filter('uiCapitalize', uiCapitalize);

    function uiCapitalize() {
        return uiCapitalizeFilter;

        ////////////////

        function uiCapitalizeFilter(value) {
            return angular.isString(value) && value.length > 0 ? value[0].toUpperCase() + value.substr(1).toLowerCase() : value;
        }
    }
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').factory('uiWindow', uiWindow);

	uiWindow.$inject = ['$window', '$rootScope'];

	function uiWindow($window, $rootScope) {
		var service = {};

		angular.element($window).bind('scroll', function () {
			$rootScope.$apply(getWindowScroll);
		});

		angular.element($window).bind('resize', function () {
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
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiTreeView', uiTreeViewDirective);

	uiTreeViewDirective.$inject = ['$timeout'];

	function uiTreeViewDirective($timeout) {
		var directive = {
			bindToController: true,
			controller: uiTreeViewController,
			controllerAs: 'vm',
			restrict: 'E',
			template:'<ui-tree-view-list list="vm.list"></ui-tree-view-list>',
			scope: {
				'list': '=',
				'config': '=?',
				'optionClick': '&?',
				'actions': '=?',
				'actionsTemplate': '@?'
			}
		};
		return directive;
	}
	function uiTreeViewController() {
		var vm = this;

		vm.config = vm.config || {};

		if (!vm.config.submenu) vm.config.submenu = 'submenu';
		if (!vm.config.name) vm.config.name = 'name';
		if (!vm.config.href) vm.config.href = 'href';
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiTreeViewList', uiTreeViewListDirective);

	uiTreeViewListDirective.$inject = ['$timeout'];

	function uiTreeViewListDirective($timeout) {
		var directive = {
			require: '^uiTreeView',
			link: link,
			restrict: 'E',
			template:'<div class="offset"></div><div class="options"><ui-tree-view-item ng-repeat="option in list" option="option"></ui-tree-view-item></div>',
			scope: {
				list: '='
			}
		};
		return directive;

		function link(scope, element, attrs, ctrl) {}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiTreeViewItem', uiTreeViewItemDirective);

	uiTreeViewItemDirective.$inject = ['$compile', '$templateCache'];

	function uiTreeViewItemDirective($compile, $templateCache) {
		var directive = {
			require: '^uiTreeView',
			template:'<div class="option-wrap" ng-class="{\'submenu\': option[config.submenu].length, \'open\': option.open}"><div class="icon-wrap"><button ng-if="option[config.submenu].length" ng-click="open(option, $event)"><i class="material-icons">arrow_drop_down</i></button></div><div class="name" ng-bind="option[config.name]" ng-click="open(option, $event, true)"></div></div><div class="list-wrap"><ui-tree-view-list class="drawer-slide-vertical keep-opacity" list="option[config.submenu]" ng-show="option.open"></ui-tree-view-list></div>',
			link: link,
			restrict: 'E',
			scope: {
				option: '='
			}
		};
		return directive;

		function link(scope, element, attrs, ctrl) {
			scope.config = ctrl.config;
			scope.actions = ctrl.actions;
			scope.open = open;

			if (ctrl.actionsTemplate) {
				var actionsHtml = $templateCache.get(ctrl.actionsTemplate),
				    actionsTemplate = $compile(actionsHtml)(scope);
				element.children('.option-wrap').append(actionsTemplate);
			}

			function open(option, event, clickName) {
				option.open = !option.open;

				if (clickName && !option[scope.config.submenu]) {
					scope.actions.clickName(option);
				}

				event.preventDefault();
			}
		}
	}
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiTabs', uiTabs);

    function uiTabs() {

        var directive = {
            bindToController: true,
            controller: controller,
            controllerAs: 'vm',
            restrict: 'E',
            transclude: true,
            scope: {
                stretch: '='
            },
            template:'<div class="bar"><div class="ui-flex wrap" ng-class="{\'stretch\': vm.stretch}"><button class="ui-button primary" type="button" ng-repeat="tab in vm.tabs" ng-click="vm.openTab(tab)" ng-class="{\'active\': tab.index === vm.tabActive.index, \'icon\': tab.icon, \'ui-ellipsis\': vm.stretch}"><i class="material-icons" ng-if="tab.icon">{{tab.icon}}</i> {{tab.name}}</button><indicator></indicator></div><div class="scroll-helper" ng-if="!vm.stretch"><div class="left" ng-if="vm.showLeft" ng-click="vm.tabsGoLeft()"><i class="material-icons">keyboard_arrow_left</i></div><div class="right" ng-if="vm.showRight" ng-click="vm.tabsGoRight()"><i class="material-icons">keyboard_arrow_right</i></div></div></div><div style="overflow: hidden"><div ng-transclude class="content ui-flex"></div></div>'
        };

        return directive;
    }

    controller.$inject = ['$element', '$animateCss', '$timeout', '$scope'];
    function controller($element, $animateCss, $timeout, $scope) {

        var vm = this;

        vm.tabs = [];
        vm.add = add;
        vm.remove = remove;
        vm.openTab = openTab;
        vm.tabsGoRight = tabsGoRight;
        vm.tabsGoLeft = tabsGoLeft;

        angular.element(window).resize(function () {
            $timeout(function () {
                openTab(vm.tabActive);
                verifyTabOverflowScroll();
            });
        });

        function add(tab) {
            tab.index = vm.tabs.length;
            if (tab.index === 0) {
                vm.tabActive = tab;
                $timeout(function () {
                    openTab(tab);
                    verifyTabOverflowScroll();
                    var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');
                    overflowContainer.on('scroll', function () {
                        verifyTabOverflowScroll();
                    });
                });
            }
            vm.tabs.push(tab);
        }

        function remove(tab) {
            var clickedTab = tab.index;

            vm.tabs.splice(vm.tabActive.index, 1);
            for (var i = vm.tabActive.index; i < vm.tabs.length; i++) {
                vm.tabs[i].index = i;
            }
            tab = vm.tabs[tab.index];

            if (clickedTab === vm.tabs.length) {
                tab = vm.tabs[clickedTab - 1];
            }

            tab && openTab(tab);
        }

        function openTab(tab) {

            var elements = $element.find('.bar .ui-button');
            var tabsContent = $element.find('ui-tab');

            var tabElement = elements.eq(tab.index);
            var contentElement = tabsContent.eq(tab.index);

            var tabElementActive = elements.eq(vm.tabActive.index);
            var contentElementActive = tabsContent.eq(vm.tabActive.index);

            $animateCss($element.find('indicator'), {
                from: {
                    width: tabElementActive.prop('offsetWidth'),
                    left: tabElementActive.prop('offsetLeft')
                },
                to: {
                    width: tabElement.prop('offsetWidth'),
                    left: tabElement.prop('offsetLeft')
                }
            }).start();

            contentElement.children().removeClass('deactive');
            $animateCss($element.find('.content'), {
                from: {
                    height: contentElementActive.height()
                },
                to: {
                    transform: 'translateX(-' + tab.index * 100 + '%)',
                    height: contentElement.height()
                } }).start().finally(function () {
                $element.find('ui-tab').map(function (index, tabItem) {
                    if (index !== tab.index) {
                        angular.element(tabItem).children().addClass('deactive');
                    } else {
                        angular.element(tabItem).children().removeClass('deactive');
                    }
                });

                $element.find('.content').height('auto');
            });

            vm.tabActive.active = false;
            tab.active = true;
            vm.tabActive = tab;

            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');
            overflowContainer.animate({ scrollLeft: tabElement.prop('offsetLeft') - 50 }, 300);
        }

        function verifyTabOverflowScroll() {
            var buttons = angular.element('ui-tabs .bar button');
            var size = 0;
            angular.forEach(buttons, function (button, index) {
                size = size + angular.element(button).outerWidth();
            });
            var overflowWidth = angular.element('ui-tabs .bar').width();
            var tabsWidth = vm.stretch ? size : size + (overflowWidth > 600 ? 54 : 6);

            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');
            var scrollLeft = overflowContainer.scrollLeft();

            $scope.$apply(function () {
                if (tabsWidth > overflowWidth) {
                    if (tabsWidth - scrollLeft === overflowWidth) {
                        vm.showRight = false;
                    } else {
                        vm.showRight = true;
                    }

                    if (scrollLeft) {
                        vm.showLeft = true;
                    } else {
                        vm.showLeft = false;
                    }
                } else {
                    vm.showLeft = false;
                    vm.showRight = false;
                }
            });
        }

        function tabsGoRight() {
            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');

            overflowContainer.animate({ scrollLeft: overflowContainer.scrollLeft() + 210 }, 300);
        }

        function tabsGoLeft() {
            var overflowContainer = angular.element('ui-tabs .ui-flex.wrap');

            overflowContainer.animate({ scrollLeft: overflowContainer.scrollLeft() - 210 }, 300);
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiTab', uiTab);

    function uiTab() {

        var directive = {
            template:'<div ng-transclude></div>',
            require: '^uiTabs',
            transclude: true,
            restrict: 'E',
            link: link,
            scope: {
                name: '@',
                icon: '@'
            }
        };

        return directive;

        function link(scope, element, attrs, ctrl) {
            scope.ctrl = ctrl;
            ctrl.add(scope);

            scope.$on('$destroy', function () {
                ctrl.remove(scope);
            });
        }
    }
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').component('uiSpinner', {
		template:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1" width="24px" height="24px" viewBox="0 0 28 28"><g class="ui-circular-loader"><path class="qp-circular-loader-path" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14"></path></g></svg>',
		controller: uiSpinnerController
	});

	uiSpinnerController.$inject = ['$element'];
	function uiSpinnerController($element) {
		var $ctrl = this;

		$ctrl.$onInit = function () {};
		$ctrl.$onChanges = function (changesObj) {};
		$ctrl.$onDestory = function () {};
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').provider('uiSnack', uiSnack);

	uiSnack.$inject = [];

	function uiSnack() {
		var provider = {
			getDelay: getDelay,
			setDelay: setDelay,
			$get: get
		},
		    _hideDelay = 5000,
		    _defaults = {
			delay: 5000,
			actionText: 'Ok'
		};

		return provider;

		////////////////

		function getDelay() {
			return _hideDelay;
		}

		function setDelay(time) {
			_hideDelay = time;
		}

		function get() {
			var service = {
				show: show,
				hide: hide,
				onHide: onHide,
				newAdded: newAdded,
				getDefaults: getDefaults
			},
			    _newAdded,
			    _hide;

			return service;

			//////////////

			function show(bar) {
				_newAdded && _newAdded(bar);
			}
			function hide() {
				_hide && _hide();
			}
			function onHide(action) {
				_hide = action;
			}
			function newAdded(action) {
				_newAdded = action;
			}
			function getDefaults() {
				return _defaults;
			}
		}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiSnackContainer', uiSnackContainer);

	uiSnackContainer.$inject = ['uiSnack', '$templateCache', '$timeout'];

	function uiSnackContainer(uiSnack, $templateCache, $timeout) {
		var directive = {
			link: link,
			template:'<ui-snack-bar ng-repeat="bar in bars" ui-bar="bar" ng-if="$index == 0"></ui-snack-bar>',
			restrict: 'E'
		};
		return directive;

		function link(scope, element, attrs) {
			var timeout;
			scope.bars = [];
			uiSnack.newAdded(function (bar) {
				// TENTAR TROCAR O NG-REPEAT POR INSERIR UM ELEMENTO
				// USANDO O $animate.enter PRA USAR OS CALLBACK -~
				bar = angular.extend({}, uiSnack.getDefaults(), bar);
				scope.bars.push(bar);
				if (scope.bars.length == 1) timerBar();
			});
			function finishTimeout() {
				scope.bars.shift();
				if (scope.bars.length) timerBar();
			}
			function timerBar() {
				if (scope.bars.length && scope.bars[0].delay) timeout = $timeout(finishTimeout, scope.bars[0].delay);
			}
			uiSnack.onHide(function () {
				if (timeout) $timeout.cancel(timeout);
				finishTimeout();
			});
		}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiSnackBar', uiSnackBar);

	uiSnackBar.$inject = ['uiSnack', '$templateCache'];

	function uiSnackBar(uiSnack, $templateCache) {
		var directive = {
			link: link,
			template:'<div class="text" ng-bind="uiBar.text"></div><button class="ui-button dark" ng-style="{\'color\': uiBar.actionColor}" ng-click="uiBar.action()" ng-if="uiBar.action" ng-bind="uiBar.actionText"></button>',
			restrict: 'E',
			scope: {
				'uiBar': '='
			}
		};
		return directive;

		function link(scope, element, attrs) {}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiSlider', uiSlider);

	function uiSlider() {
		var directive = {
			restrict: 'E',
			template:'<ui-slider-content ng-transclude></ui-slider-content>',
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

		$scope.$watch('vm.activeIndex', function (value, oldValue) {
			$timeout(function () {
				$animateCss($element, {
					from: { height: $element.outerHeight() },
					to: { height: $element.children('ui-slider-content').children().eq(value).children().outerHeight() }
				}).start().done(function () {
					$element[0].style.height = '';
				});
				value !== oldValue && activateElement(vm.slides[value]);
			});
		});

		function addSlide(slide) {
			slide.index = vm.slides.length;
			vm.slides.push(slide);
			if (vm.activeIndex === vm.slides.length - 1 || !vm.activeIndex && vm.slides.length === 1) activateElement(slide);else deactivateElement(slide);
		}

		function removeSlide(scope) {
			vm.slides.splice(scope.index, 1);
			for (var i = scope.index; i < vm.slides.length; i++) {
				vm.slides[i].index = i;
			}
		}

		function activateElement(scope) {
			if (!scope) return;
			vm.activeSlide && deactivateElement(vm.activeSlide);
			vm.activeSlide = scope;
			scope.element.removeClass('out-of-bound');
			$animate.addClass(scope.element, 'slide-active').then(function () {
				scope.onActive && scope.onActive();
			});
		}

		function deactivateElement(scope) {
			if (!scope) return;
			$animate.removeClass(scope.element, 'slide-active').then(function () {
				scope.onInactive && scope.onInactive();
				scope.element.addClass('out-of-bound');
			});
		}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiSlide', uiSlide);

	function uiSlide() {
		var directive = {
			restrict: 'AE',
			priority: 1,
			scope: {
				onActive: '&?',
				onInactive: '&?'
			},
			template:'<ui-slide-content ng-class="{\'stay-left\': index < ctrl.activeIndex, \'stay-right\': index > ctrl.activeIndex }" ng-transclude></ui-slide-content>',
			transclude: true,
			require: '^uiSlider',
			link: link
		};

		return directive;

		function link(scope, element, attributes, uiSliderController) {
			scope.index = null;
			scope.active = false;
			scope.ctrl = uiSliderController;
			scope.element = element;
			uiSliderController.addSlide(scope);
			scope.$on('$destroy', function () {
				uiSliderController.removeSlide(scope);
			});
		}
	}
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiProfileFloat', uiProfileFloat);

	uiProfileFloat.$inject = ['$templateCache', '$interval'];

	function uiProfileFloat($templateCache, $interval) {
		var directive = {
			restrict: 'E',
			scope: {
				src: '='
			},
			transclude: true,
			template:'<div ng-if="!src" ng-transclude></div><img ng-src="{{src}}" ng-if="src" ng-style="{\'max-width\': !higherWidth ? \'100%\' : \'\', \'max-height\': higherWidth ? \'100%\' : \'\'}">',
			link: link
		};
		return directive;

		function link(scope, element) {
			var loaded = false,
			    img = element.find('img'),
			    wait;
			scope.$watch('src', function (value) {
				if (!value) return;
				wait = $interval(function () {
					if (loaded) $interval.cancel(wait);
					scope.higherWidth = !img[0] || img[0].naturalWidth > img[0].naturalHeight;
				}, 0);
			});
			img.on('load', function (e) {
				scope.$apply(function () {
					loaded = true;
				});
			});
			img.on('error', function (e) {
				scope.$apply(function () {
					loaded = true;
				});
			});
		}
	}
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiMultiHandle', uiMultiHandle);

    uiMultiHandle.$inject = ['$templateCache', '$document', '$timeout', 'dateFilter'];
    function uiMultiHandle($templateCache, $document, $timeout, dateFilter) {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                range: '=?', // Array de possibilidades
                start: '=?',
                end: '=?',
                formatValue: '=?',
                show: '=?',
                disabled: '=?',
                hideBalloon: '=?'
            },
            template:'<div class="range-bar"></div><div class="points" ng-show="!disabled"><div ng-repeat="value in range" class="point"></div></div><div class="range" ng-class="{ \'disabled\': disabled }" ng-style="{\'left\': getPercentageLeft() + \'%\', \'right\': getPercentageRight() + \'%\'}"><div class="start" ng-class="{\'active\': startDragOn && !hideBalloon}"><div ng-if="startDragOn && !hideBalloon" class="value" ng-bind="formatValue(start)"></div></div><div class="end" ng-class="{\'active\': endDragOn && !hideBalloon}"><div ng-if="endDragOn && !hideBalloon" class="value" ng-bind="formatValue(end)"></div></div></div>'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var i;
            var mousedown = false;
            var percentageBlock = 100 / (scope.range.length - 1); // O primeiro item não é considerado pois estamos considerando os índices

            scope.start = scope.start || scope.range[0];
            scope.end = scope.end || scope.range[1];

            scope.formatValue = scope.formatValue || formatValue;
            scope.getPercentageLeft = getPercentageLeft;
            scope.getPercentageRight = getPercentageRight;

            var left = closestNumber(scope.start, scope.range);
            var right = closestNumber(scope.end, scope.range);

            activate();

            //////////////////

            function activate() {
                element.on('mousedown touchstart', function (e) {
                    if (scope.disabled) return;
                    var currentPosition = getPositionHours(e.pageX ? e.pageX : e.originalEvent.touches[0].pageX);
                    var newValue = closestNumber(currentPosition, scope.range);

                    if (closestNumber(currentPosition, [scope.start, scope.end]).value === left.value) {
                        left = newValue;

                        scope.$apply(function () {
                            scope.start = left.value;
                        });
                    } else {
                        right = newValue;

                        scope.$apply(function () {
                            scope.end = right.value;
                        });
                    }
                });

                element.find('.start').on('mousedown touchstart', function (e) {
                    if (scope.disabled) return;
                    mousedown = true;
                    scope.startDragOn = true;
                    changeRating(e.pageX ? e.pageX : e.originalEvent.touches[0].pageX, 'start');
                });

                element.find('.end').on('mousedown touchstart', function (e) {
                    if (scope.disabled) return;
                    mousedown = true;
                    scope.endDragOn = true;
                    changeRating(e.pageX ? e.pageX : e.originalEvent.touches[0].pageX, 'end');
                });

                $document.on('mouseup touchend', function () {
                    mousedown = false;
                    scope.startDragOn = false;
                    scope.endDragOn = false;
                });

                $document.on('mousemove touchmove', function (event) {
                    if (!mousedown) return;

                    var direction = scope.startDragOn ? 'start' : 'end';
                    changeRating(event.pageX || (event.originalEvent.touches ? event.originalEvent.touches[0].pageX : null), direction);
                    event.preventDefault();
                });
            }

            function changeRating(currentPosition, direction) {
                var newValue = closestNumber(getPositionHours(currentPosition), scope.range);

                if (direction === 'start') {
                    if (right.index <= newValue.index) {
                        scope.startDragOn = false;
                        scope.endDragOn = true;
                    } else left = newValue;

                    scope.$apply(function () {
                        scope.start = left.value;
                    });
                } else {
                    if (newValue.index <= left.index) {
                        scope.startDragOn = true;
                        scope.endDragOn = false;
                    } else right = newValue;

                    scope.$apply(function () {
                        scope.end = right.value;
                    });
                }
            }

            function getPositionHours(position) {
                var ratingArea = element.find('.range-bar');
                position -= ratingArea.offset().left;
                position = position / ratingArea.width() * 100;
                position = position > 100 ? 100 : position < 0 ? 0 : position;
                return (scope.range.length - 1) / 100 * position;
            }

            function closestNumber(number, array) {
                var current = array[0];
                var difference = Math.abs(number - current);
                var itemIndex = 0;
                for (i = 0; i < array.length; i++) {
                    var newDifference = Math.abs(number - array[i]);
                    if (newDifference < difference) {
                        difference = newDifference;
                        current = array[i];
                        itemIndex = i;
                    }
                }

                return { index: itemIndex, value: current };
            }

            function getPercentageLeft() {
                return percentageBlock * left.index;
            }

            function getPercentageRight() {
                return percentageBlock * Math.abs(right.index - (scope.range.length - 1));
            }

            function formatValue(value) {
                return value;
            }
        }
    }
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiFloatingCard', uiFloatingCardDirective);

	uiFloatingCardDirective.$inject = ['$templateCache'];

	function uiFloatingCardDirective($templateCache) {
		var directive = {
			restrict: 'E',
			transclude: true,
			scope: {
				'backgroundClick': '&'
			},
			template:'<ui-floating-card-background ng-click="backgroundClick && backgroundClick()"></ui-floating-card-background><ui-floating-card-content ng-transclude></ui-floating-card-content>',
			link: link
		};
		return directive;

		function link(scope, element, attrs) {
			var html = angular.element('html')[0];
			html.style.overflow = 'hidden';
			scope.$on('$destroy', function () {
				html.style.overflow = '';
			});
		}
	}
})();
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiDatalist', ["$timeout", "$filter", function ($timeout, $filter) {
		return {
			restrict: 'AE',
			transclude: true,
			require: '?ngModel',
			scope: {
				'list': '=',
				'idList': '@',
				'placeholderList': '@',
				'config': '=',
				'attrList': '@',
				'itemDefault': '@',
				'labelList': '@',
				'change': '=',
				'click': '='
			},
			template: '<ui-input-container><input autocomplete="off" placeholder="{{placeholderList}}" ng-change="selected()" list="{{idList}}" ng-model="choosen"><datalist id="{{idList}}"><option ng-repeat="opt in list">{{opt[config.option]}}</option></datalist><label>{{labelList}}</label></ui-input-container>',
			link: function link(scope, element, attrs, ngModel) {
				scope.config = angular.extend(scope.config || {}, {
					display: null,
					option: 'nome',
					value: 'id'
				});

				scope.$watch('list', function () {
					var _ref;

					if (scope.list && scope.itemDefault) scope.list.splice(0, 0, angular.isObject(scope.list[0]) ? (_ref = {}, _defineProperty(_ref, scope.config.option, scope.itemDefault), _defineProperty(_ref, scope.config.value, null), _ref) : scope.itemDefault);
				});

				scope.selected = function () {
					var itemSelected = scope.list.filter(function (obj) {
						return obj[scope.config.option] == scope.choosen;
					})[0];

					var rtn = !scope.attrList ? itemSelected || null : itemSelected ? itemSelected[scope.attrList] : null;
					ngModel.$setViewValue(rtn);
					scope.change && scope.change(rtn);
				};
			}
		};
	}]);
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').factory('uiContextMenu', uiContextMenu);

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
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').directive('uiContextMenu', uiContextMenuDirective);

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
				} else if (!scope.menu) return;

				var compiled = $compile($templateCache.get(attrs.uiContextMenu))(angular.extend(getModel())),
				    menu = angular.element(compiled);
				switch (strategy) {
					case 'append':
						angular.element('body').append(menu);
						scope.newPosition = {};

						if (scope.position.y + menu[0].offsetHeight + 10 > uiWindow.innerHeight) scope.newPosition.y = scope.position.y - (scope.position.y + menu[0].offsetHeight + 10 - uiWindow.innerHeight);else scope.newPosition.y = scope.position.y;

						if (scope.position.x + menu[0].offsetWidth + 10 > uiWindow.innerWidth) scope.newPosition.x = scope.position.x - (scope.position.x + menu[0].offsetWidth + 10 - uiWindow.innerWidth);else scope.newPosition.x = scope.position.x;

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
						});
						break;
					default:
						scope.menu.replaceWith(menu);
				}

				scope.menu = menu;
				scope.menu.bind('click', closeMenu);
				scope.menu.bind('mousedown', function (event) {
					event.stopPropagation();
					event.preventDefault();
				});
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
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').component('uiCalendar', {
        controller: uiCalendarController,
        template:'<header><div><div class="year" ng-bind="$ctrl.choosenDate.getFullYear()"></div><div class="date"><span ng-if="!$ctrl.choosenDate">Selecione uma data</span> <span ng-if="$ctrl.choosenDate" ng-bind="$ctrl.choosenDate | date:\'EEE, d \\\'de\\\' MMMM\' | uiCapitalize">Selecione uma data</span></div></div></header><div class="content"><div class="controls"><button class="prev round material-icons" ng-click="$ctrl.prevMonth()" ng-if="!$ctrl.uiMinDate || $ctrl.calendar.days[0].time > $ctrl.uiMinDate.getTime()" tabindex="0">keyboard_arrow_left</button> <button class="next round material-icons" ng-click="$ctrl.nextMonth()" ng-if="!$ctrl.uiMaxDate || $ctrl.calendar.days[$ctrl.calendar.days.length - 1].time < $ctrl.uiMaxDate.getTime()" tabindex="2">keyboard_arrow_right</button></div><div class="calendar-cover"></div></div><div class="actions" ng-if="$ctrl.uiConfirmSelection"><button class="ui-button teal" ng-click="$ctrl.cancel()">Cancelar</button> <button class="ui-button teal" ng-click="$ctrl.selectDate($ctrl.choosenDate)">Ok</button></div>',
        require: 'ngModel',
        bindings: {
            ngModel: '=?',
            uiViewDate: '=?',
            uiMinDate: '=?',
            uiMaxDate: '=?',
            uiFilterDate: '@?',
            uiSelect: '&?',
            uiCancel: '&?',
            uiShowOtherMonth: '=?',
            uiConfirmSelection: '=?'
        }
    });

    uiCalendarController.$inject = ['$element', '$templateCache', '$compile', '$animate', '$scope', '$timeout', '$locale', '$attrs', '$animateCss'];
    function uiCalendarController($element, $templateCache, $compile, $animate, $scope, $timeout, $locale, $attrs, $animateCss) {
        var $ctrl = this;
        var days = $locale.DATETIME_FORMATS.DAY,
            shortDays = $locale.DATETIME_FORMATS.SHORTDAY,
            months = $locale.DATETIME_FORMATS.MONTH,
            shortMonths = $locale.DATETIME_FORMATS.SHORTMONTH;

        $ctrl.$onInit = function () {
            $ctrl.ngModel = $ctrl.ngModel ? new Date($ctrl.ngModel) : $ctrl.ngModel;

            $ctrl.choosenDate = $ctrl.ngModel;
            $ctrl.uiShowOtherMonth = typeof $ctrl.uiShowOtherMonth === 'undefined' ? 'uiShowOtherMonth' in $attrs : $ctrl.uiShowOtherMonth;
            $ctrl.uiConfirmSelection = typeof $ctrl.uiConfirmSelection === 'undefined' ? 'uiConfirmSelection' in $attrs : $ctrl.uiConfirmSelection;

            $ctrl.days = days;
            $ctrl.shortDays = shortDays;
            $ctrl.months = months;
            $ctrl.shortMonths = shortMonths;

            $ctrl.uiViewDate = ('uiInitOnSelected' in $attrs ? null : angular.copy($ctrl.uiViewDate)) || angular.copy($ctrl.ngModel) || new Date();
            $ctrl.uiViewDate = new Date($ctrl.uiViewDate);
            $ctrl.uiViewDate = $ctrl.uiViewDate.constructor !== Date || isNaN($ctrl.uiViewDate.getTime()) ? new Date() : $ctrl.uiViewDate;

            renderCalendar($ctrl.uiViewDate);
        };

        $ctrl.isDay = isDay;

        $ctrl.prevMonth = function () {
            renderCalendar(getMonthSequence($ctrl.uiViewDate, -1), true);
        };

        $ctrl.nextMonth = function () {
            renderCalendar(getMonthSequence($ctrl.uiViewDate));
        };

        $ctrl.showOtherMonth = function (dayMonth, calendarMonth) {
            return dayMonth === calendarMonth || $ctrl.uiShowOtherMonth;
        };

        $ctrl.chooseDate = chooseDate;
        $ctrl.selectDate = selectDate;
        $ctrl.cancel = cancel;
        $ctrl.isDisabled = isDisabled;

        var enterAnimationPromise;
        function renderCalendar(dateTarget, prev) {
            var date = angular.copy(dateTarget);

            date.setHours(0, 0, 0, 0);
            // É setado o dia 1 para não pular mês caso o mês atual tenha 31 dias
            // e o próximo tenha apenas 30 ou menos.
            date.setDate(1);
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);

            $ctrl.uiViewDate = date;

            var info = {
                year: date.getFullYear(),
                month: date.getMonth(),
                monthDays: date.getDate(),
                lastDayWeek: date.getDay(),
                lastDayWeekName: days[date.getDay()]
            };
            date.setDate(1);

            info.firstDayWeek = date.getDay();
            info.firstDayWeekName = days[date.getDay()];
            info.totalDays = info.monthDays + info.firstDayWeek + (6 - info.lastDayWeek);
            info.days = [];

            var firstDate = -info.firstDayWeek + 1,
                lastDate = info.monthDays + (7 - info.lastDayWeek);

            for (var i = firstDate; i < lastDate; i++) {
                var date = new Date(info.year, info.month, i),
                    today = new Date();
                if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) today = true;else today = false;
                info.days.push({
                    month: date.getMonth(),
                    date: date.getDate(),
                    value: date,
                    time: date.getTime(),
                    today: today
                });
            }
            enterAnimationPromise && $animate.cancel(enterAnimationPromise);
            $animate.leave($element.find('.calendar'), {
                addClass: prev ? 'leave-right' : 'leave-left'
            });

            var calendar = $compile($templateCache.get('components/calendar/mini-calendar.tpl.html'))($scope);
            enterAnimationPromise = $animate.enter(calendar, $element.find('.calendar-cover'), null, {
                addClass: prev ? 'enter-left' : 'enter-right'
            });
            var calendarCover = $element.find('.calendar-cover');
            if ($element.find('.calendar').length > 1) {
                $timeout(function () {
                    var firstCalendar = $element.find('.calendar:first');
                    calendarCover.css('height', firstCalendar.height());
                });
            }
            $ctrl.calendar = info;
        }

        function getMonthSequence(date, num) {
            var prevMonth = angular.copy(date);
            prevMonth.setDate(1);
            prevMonth.setMonth(prevMonth.getMonth() + (num || 1));
            return prevMonth;
        }

        function isDay(value) {
            if (!$ctrl.choosenDate) return;
            var dateToCheck = angular.copy($ctrl.choosenDate);
            return dateToCheck.getDate() === value.getDate() && dateToCheck.getMonth() === value.getMonth() && dateToCheck.getFullYear() === value.getFullYear();
        }

        function chooseDate(value) {
            value = angular.copy(value);
            if (value) $ctrl.choosenDate = value;
            if (!$ctrl.uiConfirmSelection) selectDate(value);
        }

        function selectDate(value) {
            $ctrl.ngModel = value;
            $ctrl.uiSelect && $ctrl.uiSelect({ '$date': value });
        }

        function cancel() {
            $ctrl.uiCancel && $ctrl.uiCancel();
        }

        function isDisabled(value) {
            var minDate = $ctrl.uiMinDate ? new Date($ctrl.uiMinDate).getTime() : null,
                maxDate = $ctrl.uiMaxDate ? new Date($ctrl.uiMaxDate).getTime() : null,
                date = value.getTime();
            if (typeof minDate === 'number' && !isNaN(minDate) && date < minDate) return true;
            if (typeof maxDate === 'number' && !isNaN(maxDate) && date > maxDate) return true;
            return false;
        }

        $element.on('keydown', '.month-label', function (e) {
            $timeout(function () {
                switch (e.keyCode) {
                    // Seta para esquerda
                    case 37:
                        $ctrl.prevMonth();
                        break;
                    // Seta para direita
                    case 39:
                        $ctrl.nextMonth();
                        break;
                    // Seta para baixo
                    case 40:
                        $element.find('.days button:first').focus();
                        break;
                }
            });
        });

        $element.on('keydown', '.days button', function (e) {
            var target = angular.element(e.target).closest('.day');
            function getSibling(index) {
                return $element.find('.calendar .day').eq(index).children('button:not([disabled])');
            }
            $timeout(function () {
                switch (e.keyCode) {
                    // Seta para esquerda
                    case 37:
                        var toFocus = getSibling(target.index() - 1);
                        if (!toFocus.length) $element.find('.days button:not([disabled]):last').focus();else toFocus.focus();
                        break;
                    // Seta para cima
                    case 38:
                        var toFocus = getSibling(target.index() - 7);
                        var toFocusAlt = $element.find('.days button:not([disabled]):first');

                        if (toFocus.length && target.index() > toFocus.parent().index()) toFocus.focus();else if (target.index() > toFocusAlt.parent().index()) toFocusAlt.focus();else $element.find('.month-label').focus();
                        break;
                    // Seta para direita
                    case 39:
                        var toFocus = getSibling(target.index() + 1);
                        if (!toFocus.length) $element.find('.days button:not([disabled]):first').focus();else toFocus.focus();
                        break;
                    // Seta para baixo
                    case 40:
                        var toFocus = getSibling(target.index() + 7);
                        var toFocusAlt = $element.find('.days button:not([disabled]):last');

                        if (toFocus.length && target.index() < toFocus.parent().index()) toFocus.focus();else if (target.index() < toFocusAlt.parent().index()) toFocusAlt.focus();else $element.find('.month-label').focus();
                        break;
                }
            });
        });

        $element.on('keydown', function (e) {
            if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
                return false;
            }
        });
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').directive('uiColorPicker', ["$timeout", function ($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            require: ['^form', 'ngModel'],
            scope: {
                'ngModel': '=',
                'uiId': '@',
                'uiName': '@',
                'uiClass': '=?',
                'uiShape': '@',
                'uiPrimaryInfo': '@',
                'uiSelect': '&'
            },
            template:'<div><div class="ui-icon" ng-style="{\'width\': uiShape == \'round-rectangle\' && \'auto\'}"><div class="switch-color-preview ui-color{{uiShape && \' \' + uiShape}}" ng-class="{\'no-color\': !colorSelected}" ng-style="{\'background-color\': colorSelected ? colorSelected : \'#D01716\'}" data-color-range="300"></div></div><ui-input-container class="no-margin"><input type="text" ng-class="uiClass" name="{{uiName}}" ng-readonly="switchOpened" ng-pattern="/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/" class="txt-color-switch" ng-model="ngModel" ng-focus="switchOpen()" style="user-select: none" autocomplete="off" ng-style="{\'color\': uiShape == \'round-rectangle\' && \'transparent\'}"> <label>Cor</label></ui-input-container><div class="switch-color" ng-if="switchOpened"><div class="no-color" ng-click="setColorType(null)"></div><div ng-repeat="colorType in colorTypes" ng-class="colorClass(\'bg-\' + colorType + \'-500\')" ng-click="setColorType($event, colorType)"></div><div class="switch-var" ng-class="{\'ui-show\':colorTypeSelected}" ng-style="{\'top\': switchVarTop}" style="top: -47px;"><div class="ui-color {{colorTypeSelected != null ? \'bg-\' + colorTypeSelected + \'-\' + colorVariation : \'\'}}" ng-repeat="colorVariation in colorVariations" ng-class="{\'ui-show\':checkAccentColor(colorVariation)}" data-color-range="{{colorVariation}}" ng-click="selectColor($event)"></div><div class="arrow" ng-style="{\'margin-left\': switchVarArrowLeft}" style="margin-left: 57px;"></div></div></div></div>',
            link: function link(scope, element, attrs, ctrls, transclude) {
                // element.find('ui-form-transclude').replaceWith(transclude());
                scope.colorTypes = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'];
                scope.colorVariations = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
                scope.switchOpened = false;
                scope.colorTypeSelected = undefined;
                scope.colorSelected = undefined;
                scope.switchOpen = function () {
                    scope.colorTypeSelected = undefined;
                    scope.switchOpened = true;
                };
                scope.switchClose = function () {
                    scope.switchOpened = false;
                };
                scope.switchVarTop = undefined;
                scope.switchVarArrowLeft = undefined;
                scope.setColorType = function ($event, color) {
                    scope.colorTypeSelected = color;
                    if (color == undefined) {
                        scope.selectColor();
                        return;
                    }
                    scope.switchVarTop = angular.element($event.currentTarget).offset().top - angular.element(element.find('.switch-color')).offset().top - 50;
                    scope.switchVarArrowLeft = angular.element($event.currentTarget).offset().left - angular.element(element.find('.switch-color')).offset().left + angular.element($event.currentTarget).width() / 2 - 6;
                };
                scope.colorClass = function (color) {
                    return color;
                };
                scope.checkAccentColor = function (variation) {
                    if (scope.colorTypeSelected == 'brown' || scope.colorTypeSelected == 'grey' || scope.colorTypeSelected == 'blue-grey') {
                        if (variation == 'A100' || variation == 'A200' || variation == 'A400' || variation == 'A700') return false;
                    }
                    return true;
                };

                angular.element(document).bind('mousedown focusin', function (e) {
                    if (!angular.element(element).find(e.target).length && scope.switchOpened) {
                        scope.switchClose();
                        scope.$apply();
                    }
                });
                scope.selectColor = function ($event) {
                    scope.colorSelected = $event ? rgb2hex($($event.currentTarget).css('background-color')).toUpperCase() : undefined;
                    ctrls[1].$setViewValue(scope.colorSelected ? scope.colorSelected : 'Nenhuma cor selecionada');
                    ctrls[1].$render();
                    ctrls[0][scope.uiName].$setDirty();
                    scope.switchClose();
                    $timeout(scope.uiSelect);
                };

                ctrls[1].$formatters.push(function (value) {
                    scope.colorSelected = value;
                    ctrls[1].$setViewValue(value ? value : 'Nenhuma cor selecionada');
                    ctrls[0].$setPristine(); // Dentro do formatters, faz o campo nascer como pristine, caso contrÃ¡rio ele perde a propriedade
                    return value;
                });

                function rgb2hex(rgb) {
                    var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
                    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    function hex(x) {
                        return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
                    }
                    return '#' + (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
                }
            }
        };
    }]);
})();
'use strict';

(function () {
	'use strict';

	angular.module('smn-ui').animation('.ui-expand', uiExpandAnimation);

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
			return function () {
				state.animating = true;
				state.animator = animator;
				state.doneFn = doneFn;
				animator.start().finally(function () {
					// closing &&
					if (state.doneFn === doneFn) {
						element[0].style.height = '';
						element[0].style.width = '';
					}
					state.animating = false;
					state.animator = undefined;
					state.doneFn();
				});
			};
		}

		function addClass(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element)),
				    height = state.animating && state.height ? state.height : element[0].offsetHeight,
				    width = state.animating && state.width ? state.width : element[0].offsetWidth;

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
						state.doneFn = generateRunner(true, state, animator, element, doneFn);
						return state.animator.end();
					} else {
						state.width = width;
						state.height = width;
						return generateRunner(true, state, animator, element, doneFn)();
					}
				}
			}
			doneFn();
		}

		function removeClass(element, className, doneFn) {
			if (className == 'ng-hide') {
				var state = getState(getId(element)),
				    height = state.animating && state.height ? state.height : 0,
				    width = state.animating && state.width ? state.width : 0;

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
						state.doneFn = generateRunner(false, state, animator, element, doneFn);
						return state.animator.end();
					} else {
						state.width = width;
						state.height = height;
						return generateRunner(false, state, animator, element, doneFn)();
					}
				}
			}
			doneFn();
		}
	}
})();
'use strict';

(function () {
    'use strict';

    uiStructController.$inject = ["$element", "$window"];
    angular.module('smn-ui').component('uiStruct', {
        controller: uiStructController
    });

    function uiStructController($element, $window) {
        var $ctrl = this;

        $ctrl.$postLink = function () {
            angular.element($window).bind('scroll', function (e) {
                if (window.pageYOffset) $element.addClass('not-on-top');else $element.removeClass('not-on-top');
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('smn-ui').factory('uiColor', uiColor);

    uiColor.$inject = ['$timeout'];

    function uiColor($timeout) {
        var service = {
            isBright: isBright,
            hexToRgb: hexToRgb
        };
        return service;

        ////////////////

        function isBright(hex, minDarkPerc) {
            var color = hexToRgb(hex);
            if (!color) return false;
            // Contando a luminosidade perceptiva
            // O olho humano favorece a cor verde
            var luminosityPerc = 1 - (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
            return luminosityPerc < (minDarkPerc || 0.3);
        }

        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }
})();
"use strict";

angular.module("smn-ui").run(["$templateCache", function ($templateCache) {
  $templateCache.put("components/calendar/mini-calendar.tpl.html", "<div class=calendar><div class=label><button class=month-label ui-autofocus><span ng-bind=\"::($ctrl.months[$ctrl.calendar.month] + \' de \' + $ctrl.calendar.year) | uiCapitalize\"></span></button></div><div class=week-header><div class=week-day ng-repeat=\"day in ::$ctrl.days\" ng-bind=\"::day.substring(0,1) | uiCapitalize\"></div></div><div class=days><div class=day ng-class=\"::{\'today\': day.today, \'other-month\': day.month !== $ctrl.calendar.month}\" ng-repeat=\"day in ::$ctrl.calendar.days\"><button type=button class=round ng-class=\"{\'selected\': $ctrl.isDay(day.value)}\" ng-bind=::day.date ng-click=\"!$ctrl.isDisabled(day.value) && $ctrl.chooseDate(day.value)\" ng-disabled=$ctrl.isDisabled(day.value) ng-if=\"::$ctrl.showOtherMonth(day.month, $ctrl.calendar.month)\"></button></div></div></div>");
  $templateCache.put("components/spinner/spinner-icon.tpl.html", "<svg xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink version=1 width=24px height=24px viewBox=\"0 0 28 28\"><g class=ui-circular-loader><path class=qp-circular-loader-path fill=none d=\"M 14,1.5 A 12.5,12.5 0 1 1 1.5,14\"/></g></svg>");
  $templateCache.put("components/tabs/tab.directive.tpl.html", "<div ng-transclude></div>");
  $templateCache.put("components/tabs/tabs.directive.tpl.html", "<div class=bar><div class=\"ui-flex wrap\" ng-class=\"{\'stretch\': vm.stretch}\"><button class=\"ui-button primary\" type=button ng-repeat=\"tab in vm.tabs\" ng-click=vm.openTab(tab) ng-class=\"{\'active\': tab.index === vm.tabActive.index, \'icon\': tab.icon, \'ui-ellipsis\': vm.stretch}\"><i class=material-icons ng-if=tab.icon>{{tab.icon}}</i> {{tab.name}}</button><indicator></indicator></div><div class=scroll-helper ng-if=!vm.stretch><div class=left ng-if=vm.showLeft ng-click=vm.tabsGoLeft()><i class=material-icons>keyboard_arrow_left</i></div><div class=right ng-if=vm.showRight ng-click=vm.tabsGoRight()><i class=material-icons>keyboard_arrow_right</i></div></div></div><div style=\"overflow: hidden\"><div ng-transclude class=\"content ui-flex\"></div></div>");
}]);