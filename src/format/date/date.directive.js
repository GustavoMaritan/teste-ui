(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiDateFormat', uiDateFormat);

    function uiDateFormat($locale, $filter) {
        var directive = {
            require: '?ngModel',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            if (!ctrl)
                return;
            ctrl.$formatters.push(function (value) {
                value = $filter('date')(value, getDateMask());
                ctrl.$modelValue = value;
                return value;
            });
            ctrl.$parsers.push(function (value) {
                if (!value)
                    return null;
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
                if (!/^[\d, \/]+$/.test(value))
                    return false;
                var splittedDate = value.split('/');
                if (splittedDate.length !== 3)
                    return false;
                var dayIndex, monthIndex, yearIndex;

                var mask = getDateMask();
                mask = mask.split('/');
                for (var i = 0; i < 3; i++) {
                    if (mask[i].indexOf('d') > -1)
                        dayIndex = i;
                    if (mask[i].indexOf('M') > -1)
                        monthIndex = i;
                    if (mask[i].indexOf('y') > -1)
                        yearIndex = i;
                }

                if (isNaN(dayIndex) || isNaN(monthIndex) || isNaN(yearIndex))
                    return false;

                var date = splittedDate[dayIndex],
                    month = splittedDate[monthIndex],
                    year = splittedDate[yearIndex];
                if (!date || !month || !year)
                    return false;
                if (month < 1 || month > 12) {
                    return false;
                }
                var dateCheck = new Date(year, month, 0).getDate();
                if (date > dateCheck || date < 1)
                    return false;
                var validDate = new Date(year, month - 1, date);
                return validDate;
            }
        }
    }

})();

