/**
 * Created by Manuel on 11/03/2015.
 */
(function (module) {
    'use strict';
    module.factory("NumberServ", NumberServ);

    function NumberServ($filter, $locale) {
        return {
            isNumber: isNumber,
            isNumberMayorCero: isNumberMayorCero,
            isNumberAMayorToB: isNumberAMayorToB,
            isNumberAMayorIgualToB: isNumberAMayorIgualToB,
            isNumberMayorIgualCero: isNumberMayorIgualCero,
            isNumberBetween: isNumberBetween,
            redondear: redondear,
            getRandomNumber: getRandomNumber
        };


        function isNumber(value) {
            return $.isNumeric(value);
        }

        function isNumberMayorCero(value) {
            if (this.isNumber(value)) {
                return Number(value) > 0;
            }
            return false;
        }

        function isNumberAMayorToB(valueA, valueB) {
            return Number(valueA) > Number(valueB);
        }

        function isNumberAMayorIgualToB(numberA, numberB){
            return new Number(numberA)>=new Number(numberB);
        }

        function isNumberMayorIgualCero(value) {
            if ($.isNumeric(value)) {
                return Number(value) >= 0;
            }
            return false;
        }

        function isNumberBetween(value, start, end) {
            if ($.isNumeric(value)) {
                var numberValue = Number(value);
                return numberValue >= start && numberValue <= end;
            }
            return false;
        }

        function redondear(value, fractionSize) {
            var formattedValue = $filter('number')(value, fractionSize);
            var re = new RegExp("\\" + $locale.NUMBER_FORMATS.GROUP_SEP, "g");
            var replaced = formattedValue.replace(re, "");
            return Number(replaced);
        }

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }
})(IsyplusApp);