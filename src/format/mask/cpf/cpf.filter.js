(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiCpf', uiCpf);

    function uiCpf() {
        return uiCpfFilter;

        function uiCpfFilter(cpf) {
            if (!cpf) return '';
            cpf = cpf.toString().replace(/[^0-9]+/g, '');
            if (cpf.length > 3)
                cpf = cpf.substring(0,3) + '.' + cpf.substring(3);
            if (cpf.length > 7)
                cpf = cpf.substring(0,7) + '.' + cpf.substring(7);
            if (cpf.length > 11)
                cpf = cpf.substring(0,11) + '-' + cpf.substring(11);
            if (cpf.length > 14)
                cpf = cpf.substring(0,14);
            return cpf;
        }
    }

})();

