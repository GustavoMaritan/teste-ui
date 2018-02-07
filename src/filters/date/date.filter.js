(function () {
	'use strict';
	
	angular
		.module('smn-ui')
		.filter('uiStringDate', uiFullDate);
	
	function uiFullDate() {
		return uiFullDateFilter;
	}
	function uiFullDateFilter(date) {
		var today = new Date(),
			yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
			months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
			weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
			sevenDaysInMil = 1000 * 60 * 60 * 24 * 7;
		today.setHours(0,0,0,0);
		yesterday.setHours(0,0,0,0);
		date = new Date(date);
		date.setHours(0,0,0,0);
		switch (true) {
			case today.getTime() === date.getTime():
				date = 'Hoje';
				break;
			case yesterday.getTime() === date.getTime():
				date = 'Ontem';
				break;
			case today.getTime() - sevenDaysInMil <= date.getTime():
				date = weekDays[date.getDay()];
				break;
			default:
				date = date.getDate() + ' de ' + months[date.getMonth()].toLowerCase() + ' de ' + date.getFullYear();
				break;
		}
		return date;
	}
})();