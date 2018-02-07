(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiUnaccent', uiUnaccent);

    function uiUnaccent() {
        return function (strAccents) {
            if (!strAccents)
                return '';
            var strAccents = strAccents.split('');
            var strAccentsOut = [];
            var strAccentsLen = strAccents.length;
            var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
            for (var y = 0; y < strAccentsLen; y++) {
                if (accents.indexOf(strAccents[y]) != -1) {
                    strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
                } else
                    strAccentsOut[y] = strAccents[y];
            }
            strAccentsOut = strAccentsOut.join('');
            return strAccentsOut;
        };
    }
})();