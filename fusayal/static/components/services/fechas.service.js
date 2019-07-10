/**
 * Created by Manuel on 11/03/2015.
 */
(function (module) {
    'use strict';
    module.factory("FechasServ", FechasServ);

    function FechasServ() {

        return {
            format_momment_date: format_momment_date,
            parse_cadena: parse_cadena,
            get_fecha_actual: get_fecha_actual,
            sumar_dias: sumar_dias,
            sumar_anios: sumar_anios,
            change_year: change_year,
            change_month_year: change_month_year,
            change_day_month_year: change_day_month_year,
            change_day_month: change_day_month,
            change_day: change_day,
            getDiaSemanaCorto: getDiaSemanaCorto,
            get_ls_dias_corto: get_ls_dias_corto,
            getDiaSemanaLargo: getDiaSemanaLargo,
            get_ls_dias_largo: get_ls_dias_largo,
            getMesCorto: getMesCorto,
            get_str_mes_corto: get_str_mes_corto,
            getMesLargo: getMesLargo,
            get_str_mes_largo: get_str_mes_largo,
            getFechaLetras: getFechaLetras,
            esFechaValida: esFechaValida
        };

        function format_momment_date(DATE) {
            return DATE.format('DD/MM/YYYY');
        }

        function parse_cadena(cadena) {
            return moment(cadena, 'DD/MM/YYYY');
        }

        function get_fecha_actual() {
            var Date = moment();
            return format_momment_date(Date);
        }

        function sumar_dias(fechastr, ndias) {
            var Date = parse_cadena(fechastr);
            var DateSumado = Date.add('days', ndias);
            return format_momment_date(DateSumado);
        }

        function sumar_anios(fechastr,nanios) {
            var Date = parse_cadena(fechastr);
            var DateSumado = Date.add('year', nanios);
            return format_momment_date(DateSumado);
        }

        function change_year(fechastr, year) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.year(year);
            return format_momment_date(tipo_fecha);
        }

        function change_month_year(fechastr, month, year) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.year(year);
            tipo_fecha.month(month - 1);
            return format_momment_date(tipo_fecha);
        }

        function change_day_month_year(fechastr, day, month, year) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.date(day);
            tipo_fecha.year(year);
            tipo_fecha.month(month - 1);
            return format_momment_date(tipo_fecha);
        }

        function change_day_month(fechastr, day, month) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.date(day);
            tipo_fecha.month(month - 1);
            return format_momment_date(tipo_fecha);
        }

        function change_day(fechastr, day) {
            var tipo_fecha = parse_cadena(fechastr);
            tipo_fecha.date(day);
            return format_momment_date(tipo_fecha);
        }

        function getDiaSemanaCorto(day_int) {
            var ls = get_ls_dias_corto();
            return ls[day_int]
        }

        function get_ls_dias_corto() {
            return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"]
        }

        function getDiaSemanaLargo(day_int) {
            return get_ls_dias_largo()[day_int];
        }

        function get_ls_dias_largo() {
            return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"]
        }

        function getMesCorto(day_int) {
            var ls = get_str_mes_corto();
            return ls[day_int]
        }

        function get_str_mes_corto() {
            return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agos", "Sept", "Oct", "Nov", "Dic"]
        }

        function getMesLargo(day_int) {
            var ls = get_str_mes_largo();
            return ls[day_int]
        }

        function get_str_mes_largo() {
            return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septtiembre", "Octubre", "Noviembre", "Diciembre"]
        }

        function getFechaLetras(fecha) {
            return getDiaSemanaLargo(fecha.weekday()) + ', ' +
                fecha.get('date') + ' de ' + getMesLargo(fecha.get('month')) +
                ' del ' + fecha.get('year');
        }

        /**
         * Verifica si una cadena ingresada esta en el formato dd/mm/yyyy es una fecha valida
         * @param fecha
         * @returns {*}
         */
        function esFechaValida(fecha) {
            return moment(fecha, 'DD/MM/YYYY', true).isValid();
        }
    }
})(IsyplusApp);