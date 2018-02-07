(function () {
    'use strict';

    angular
        .module('core')
        .controller('CoreController', CoreController);

    function CoreController(uiToolbar) {
        var vm = this;
        vm.hoje = new Date();
        vm.ontem = new Date();
        vm.ontem.setHours(-1);

        vm.users = [{
            id: 1,
            name: 'Jhon Doe'
        }];

        activate();

        ////////////////

        function activate() {
            console.log('Core controller loaded with success');
        }

        vm.teste = function (data, file) {
            if(!data && !file) {
                return;
            }
            console.log(file)
        }

        vm.error = function (file, errors, index) {
            console.log('error');
            console.log(file.name, errors, index);
        }
    }

})();


