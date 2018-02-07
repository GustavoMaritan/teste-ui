(function () {
    'use strict';

    angular
        .module('smn-ui')
        .service('uiCurrencyMaskUtils', uiCurrencyMaskUtils);

    function uiCurrencyMaskUtils() {
        var CurrencyMaskUtils;
        return CurrencyMaskUtils = (function() {
            function CurrencyMaskUtils() {}

            CurrencyMaskUtils.clearSeparators = function(value) {
                if (value == null) {
                    return;
                }
                if (typeof value === 'number') {
                    value = value.toString();
                }
                return parseFloat(value.replace(/,/g, '.').replace(/\.(?![^.]*$)/g, ''));
            };

            CurrencyMaskUtils.toIntCents = function(value) {
                if (value != null) {
                    var fixedCents = Math.abs(parseInt(CurrencyMaskUtils.clearSeparators(value) * 100));
                    return fixedCents / 100;
                }
            };

            CurrencyMaskUtils.toFloatString = function(value) {
                if (value != null) {
                    return (Math.abs(value)).toFixed(2); // dentro do abs tava / 100
                }
            };

            return CurrencyMaskUtils;

        })();
    }

})();