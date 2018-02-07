(function() {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiTreeView', uiTreeViewDirective);

	uiTreeViewDirective.$inject = ['$timeout'];

	function uiTreeViewDirective($timeout) {
		var directive = {
			bindToController: true,
			controller: uiTreeViewController,
			controllerAs: 'vm',
			restrict: 'E',
			templateUrl: 'components/tree-view/tree-view.directive.html',
			scope: {
				'list': '=',
				'config': '=?',
				'optionClick': '&?',
				'actions': '=?',
				'actionsTemplate': '@?'
			},
		};
		return directive;
	}
	function uiTreeViewController () {
		var vm = this;

		vm.config = vm.config || {};

		if (!vm.config.submenu)
			vm.config.submenu = 'submenu';
		if (!vm.config.name)
			vm.config.name = 'name';
		if (!vm.config.href)
			vm.config.href = 'href';
	}
})();