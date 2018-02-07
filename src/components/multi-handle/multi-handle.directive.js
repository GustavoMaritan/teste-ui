(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMultiHandle', uiMultiHandle);

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
            templateUrl: 'components/multi-handle/multi-handle.directive.html'
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
                    if (scope.disabled)
                        return;
                    var currentPosition = getPositionHours(e.pageX ? e.pageX : e.originalEvent.touches[0].pageX);
                    var newValue = closestNumber(currentPosition, scope.range);
                    
                    if (closestNumber(currentPosition, [scope.start, scope.end]).value === left.value) {
                        left = newValue;

                        scope.$apply(function(){
                            scope.start = left.value;
                        });
                    }
                    else {
                        right = newValue;

                        scope.$apply(function(){
                            scope.end = right.value;
                        });
                    }
                });

                element.find('.start').on('mousedown touchstart', function (e) {
                    if (scope.disabled)
                        return;
                    mousedown = true;
                    scope.startDragOn = true;
                    changeRating(e.pageX ? e.pageX : e.originalEvent.touches[0].pageX, 'start');
                });

                element.find('.end').on('mousedown touchstart', function (e) {
                    if (scope.disabled)
                        return;
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
                    if (!mousedown)
                        return;

                    var direction = scope.startDragOn ? 'start': 'end';
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
                    }
                    else
                        left = newValue;

                    scope.$apply(function(){
                        scope.start = left.value;
                    });
                }
                else {
                    if (newValue.index <= left.index) {
                        scope.startDragOn = true;
                        scope.endDragOn = false;
                    }
                    else
                        right = newValue;

                    scope.$apply(function(){
                        scope.end = right.value;
                    });
                }

            }

            function getPositionHours(position) {
                var ratingArea = element.find('.range-bar');
                position -= ratingArea.offset().left;
                position = position / ratingArea.width() * 100;
                position = position > 100 ? 100 : position < 0 ? 0 : position;
                return ((scope.range.length - 1) / 100) * position;
            }
            
            function closestNumber(number, array) {
                var current = array[0];
                var difference = Math.abs(number - current);
                var itemIndex = 0;
                for (i = 0; i < array.length; i++) {
                    var newDifference = Math.abs (number - array[i]);
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

