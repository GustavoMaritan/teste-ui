(function () {
	'use strict';

	angular
		.module('smn-ui')
		.provider('uiSnack', uiSnack);

	uiSnack.$inject = [];

	function uiSnack() {
		var provider = {
			getDelay: getDelay,
			setDelay: setDelay,
			$get: get
		},
			_hideDelay = 5000,
			_defaults = {
				delay: 5000,
				actionText: 'Ok'
			};

		return provider;

		////////////////

		function getDelay() {
			return _hideDelay;
		}

		function setDelay(time) {
			_hideDelay = time;
		}

		function get() {
			var service = {
				show: show,
				hide: hide,
				onHide: onHide,
				newAdded: newAdded,
				getDefaults: getDefaults
			},
				_newAdded,
				_hide;

			return service;

			//////////////

			function show(bar) {
				_newAdded && _newAdded(bar);
			}
			function hide() {
				_hide && _hide();
			}
			function onHide(action) {
				_hide = action;
			}
			function newAdded(action) {
				_newAdded = action;
			}
			function getDefaults() {
				return _defaults;
			}
		}
	}
})();