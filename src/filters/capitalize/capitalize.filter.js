(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiCapitalize', uiCapitalize);

    function uiCapitalize() {
        return uiCapitalizeFilter;

        ////////////////

        function uiCapitalizeFilter(value) {
            return (angular.isString(value) && value.length > 0) ? value[0].toUpperCase() + value.substr(1).toLowerCase() : value;
        }
    }

})();

