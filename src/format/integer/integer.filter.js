(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiInteger', uiInteger);

    function uiInteger() {
        return uiIntegerFilter;

        ////////////////

        function uiIntegerFilter(value) {
            if (value === undefined || value === null)
                return null;
            value = value.toString().replace(/\D+/g, '');
            value = value ? parseInt(value) : null;
            return value;
        }
    }

})();

