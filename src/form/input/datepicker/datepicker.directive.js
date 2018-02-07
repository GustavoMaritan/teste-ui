(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiDatepicker', uiDatepicker);

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
            var picker, mask, pickerGroup, fromEnter, toEnter,
                target = scope.uiDatepicker ? angular.element(scope.uiDatepicker) : element;

            element.on(attrs.uiPickerEvent || 'focus', function (e) {
                renderPicker(target);
            });

            scope.closePicker = closePicker;
            scope.select = select;

            function renderPicker(target) {
                pickerGroup = $compile(
                    '<ui-background-mask class="ui-picker-mask" ng-mousedown="closePicker($event)"></ui-background-mask>' +
                    '<ui-calendar class="ui-picker" ' +
                                 'tabindex="0" ' +
                                 'ui-select="select($date)" ' +
                                 'ui-cancel="closePicker()" ' +
                                 'ui-view-date="uiViewDate" ' +
                                 'ui-min-date="uiMinDate" ' +
                                 'ui-max-date="uiMaxDate" ' +
                                 'ui-view-date="ngModel" ' +
                                 ('uiInitOnSelected' in attrs ? 'ui-init-on-selected ' : '') +
                                 'ng-model="ngModel"></ui-calendar>')(scope);
                var inputOffset = target.offset(),
                    padding = 16;

                angular.element('body').append(pickerGroup);
                mask = angular.element(pickerGroup[0]);
                picker = angular.element(pickerGroup[1]);

                $timeout(function() {
                    var pickerSize = {
                        height: picker[0].scrollHeight,
                        width: picker[0].clientWidth
                    };

                    var correctionMatrix = {
                        x: 0,
                        y: 0
                    }

                    var pickerHorizontalCoveringArea = inputOffset.left + picker[0].clientWidth + padding + (!scope.ngReadonly ? target[0].clientHeight : 0),
                        pickerVerticalCoveringArea = inputOffset.top + picker[0].clientHeight + padding + (!scope.ngReadonly ? target[0].clientHeight : 0);

                    if (pickerHorizontalCoveringArea > window.innerWidth + document.body.scrollTop)
                        correctionMatrix.x = window.innerWidth + document.body.scrollTop - pickerHorizontalCoveringArea;
                    if (pickerVerticalCoveringArea > window.innerHeight + document.body.scrollTop)
                        correctionMatrix.y = window.innerHeight + document.body.scrollTop - pickerVerticalCoveringArea;

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
                        transform: 'scale(1) ' + $interpolate('translate({{x}}px, {{y}}px)')({x: correctionMatrix.x, y: correctionMatrix.y})
                    };
                    $animate.enter(picker, document.body, angular.element('body > *:last-child'), {
                        from: fromEnter,
                        to: toEnter
                    }).then(function () {
                        picker.css({height: '', width: ''});
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
                    if (e.keyCode === 27)
                        scope.closePicker();
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

