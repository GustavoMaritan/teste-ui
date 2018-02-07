(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiCurrency', uiCurrency);

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