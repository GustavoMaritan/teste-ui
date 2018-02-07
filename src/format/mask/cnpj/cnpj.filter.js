(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiCnpj', uiCnpj);

    function uiCnpj() {
        return uiCnpjFilter;

        ////////////////

        function uiCnpjFilter(cnpj){
            if (!cnpj) return '';
            cnpj = cnpj.toString().replace(/[^0-9]+/g, '');
            if (cnpj.length > 2)
                cnpj = cnpj.substring(0,2) + '.' + cnpj.substring(2);
            if (cnpj.length > 6)
                cnpj = cnpj.substring(0,6) + '.' + cnpj.substring(6);
            if (cnpj.length > 10)
                cnpj = cnpj.substring(0,10) + '/' + cnpj.substring(10);
            if (cnpj.length > 15)
                cnpj = cnpj.substring(0,15) + '-' + cnpj.substring(15);
            if (cnpj.length > 18)
                cnpj = cnpj.substring(0,18);
            return cnpj;
        }
    }

})();

