(function () {
    'use strict';

    angular
        .module('smn-ui')
        .filter('uiPhone', uiPhone);

    function uiPhone() {
        return uiPhoneFilter;

        ////////////////

        function uiPhoneFilter(phone) {
            if (!phone) return;
            phone = phone.toString().replace(/[^0-9]+/g,'');
            if (phone.length > 0)
                phone = '(' + phone;
            if (phone.length > 3)
                phone = phone.substring(0,3) + ') ' + phone.substring(3);
            if (phone.length > 9 && phone.length < 14)
                phone = phone.substring(0,9) + '-' + phone.substring(9);
            else if (phone.length > 13)
                phone = phone.substring(0,10) + '-' + phone.substring(10);
            if (phone.length > 15)
                phone = phone.substring(0,15);
            return phone;
        }
    }

})();

