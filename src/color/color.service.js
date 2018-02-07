(function () {
    'use strict';

    angular
        .module('smn-ui')
        .factory('uiColor', uiColor);

    uiColor.$inject = ['$timeout'];

    function uiColor($timeout) {
        var service = {
            isBright: isBright,
            hexToRgb: hexToRgb
        };
        return service;

        ////////////////

        function isBright(hex, minDarkPerc) {
            var color = hexToRgb(hex);
            if (!color)
                return false;
            // Contando a luminosidade perceptiva
            // O olho humano favorece a cor verde
            var luminosityPerc = 1 - (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
            return (luminosityPerc < (minDarkPerc || 0.3));
        }

        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }

})();

