(function () {
    'use strict';

    angular
        .module('smn-ui')
        .directive('uiMainMenu', uiMainMenu);

    uiMainMenu.$inject = ['$templateCache'];

    function uiMainMenu($templateCache) {
        var directive = {
            restrict: 'E',
            templateUrl: 'struct/main-menu/main-menu.directive.html',
            scope: {
                'menuList': '=',
                'config': '=?',
                'menuClick': '&?'
            },
            bindToController: true,
            controller: uiMainMenuController,
            controllerAs: 'vm'
        };
        return directive;
    }

    uiMainMenuController.$inject = ['$scope'];

    function uiMainMenuController($scope) {

        var vm = this;
        vm.level = 0;

        if (vm.config) {
            if (!vm.config.submenu)
                vm.config.submenu = 'submenu';
            if (!vm.config.favorite)
                vm.config.favorite = 'favorite';
            if (!vm.config.name)
                vm.config.name = 'name';
            if (!vm.config.icon)
                vm.config.icon = 'icon';
            if (!vm.config.href)
                vm.config.href = 'href';
        }
    }
})();