(function() {
	'use strict';

	angular
		.module('smn-ui')
		.directive('uiTreeViewList', uiTreeViewListDirective);

	uiTreeViewListDirective.$inject = ['$timeout'];

	function uiTreeViewListDirective($timeout) {
		var directive = {
			require: '^uiTreeView',
			link: link,
			restrict: 'E',
			templateUrl: 'components/tree-view/tree-view-list.directive.html',
			scope: {
				list: '='
			}
		};
		return directive;
		
		function link(scope, element, attrs, ctrl) {
		}
	}
})();