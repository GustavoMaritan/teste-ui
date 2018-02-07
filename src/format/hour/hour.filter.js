(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiHour', uiHour);

    function uiHour() {
        return uiHourFilter;

        ////////////////

        function uiHourFilter(value) {
            if (value === undefined || value === null)
                return null;

            value = value.toString().substring(0,2).replace(/\D+/g, '');
            value = value ? parseInt(value) : null;
            return value;
        }
    }

})();

