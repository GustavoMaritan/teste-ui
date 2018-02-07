(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiCep', uiCep);

    function uiCep() {
        return uiCepFilter;

        function uiCepFilter(cep) {
            if (!cep) return '';
            cep = cep.toString().replace(/[^0-9]+/g, '');
            if (cep.length > 5)
                cep = cep.substring(0,5) + '-' + cep.substring(5);
            if (cep.length > 9)
                cep = cep.substring(0,9);
            return cep;
        }
    }

})();

