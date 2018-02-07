(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiMinute', uiMinute);

    function uiMinute() {
        return uiMinuteFilter;

        ////////////////

        function uiMinuteFilter(value) {
            if (value === undefined || value === null)
                return null;

            value = value.toString().substring(0,2).replace(/\D+/g, '');
            value = value ? parseInt(value) : null;
            return value;
        }
    }

})();

