# -*- coding:UTF-8 -*-
"""
Created on '01/12/2014'
@author: 'Manuel'
"""
import calendar
import logging
import datetime

from math import fabs

from fusayal.utils import ctes

log = logging.getLogger(__name__)

def format_cadena( cadena, fmtini, fmtdest ):
    fecha = parse_cadena(cadena, fmtini)
    return parse_fecha(fecha, fmtdest)

def format_cadena_db( cadena ):
    """Retorna un string que representa en el formato de base de datos aaaa-mm-dd"""
    return format_cadena(cadena, ctes.APP_FMT_FECHA, ctes.APP_FMT_FECHA_DB)

def parse_cadena( cadena, formato=ctes.APP_FMT_FECHA):
    '''Retorna un tipo fecha dada una cadena y el formato especificado'''
    return datetime.datetime.strptime(cadena, formato)

def parse_cadena_ttod(cadena, formato=ctes.APP_FMT_FECHA_HORA):
    '''Retorna un tipo fecha sin hora data una cadena fechahora y el formato especificado'''
    return datetime.datetime.strptime(cadena, formato).date()

def getFechaLetras(fecha):
    dia = parse_fecha(fecha,'%d de  ')
    mes = get_str_mes_largo(fecha.month-1)
    anio = parse_fecha(fecha,' del %Y ')
    return dia+mes+anio

def getDiaFechaLetras1(fecha):
    diasemana = get_str_dia_largo(get_dia_de_la_semana(fecha))
    dia = parse_fecha(fecha,' %d de  ')
    mes = get_str_mes_corto(fecha.month-1)
    anio = parse_fecha(fecha,' del %Y ')
    return diasemana+dia+mes+anio

def parse_fecha( fecha, formato ):
    '''Retorna una cadena dada la fecha y el formato especificado'''
    if fecha is not None:
        return fecha.strftime( formato )
    else:
        return ''

def get_str_fecha_actual(formato=ctes.APP_FMT_FECHA):
    return parse_fecha(datetime.datetime.now(), formato)

def get_str_fecha(fecha, formato):
    return parse_fecha(fecha, formato)

def sumar_dias(fecha,dias):
    return ( fecha + datetime.timedelta(days=dias) )

def sumar_meses(fecha, meses):
    """Suma el numero de meses indicados a la fecha, requiere instalar el modulo python-dateutil"""
    from dateutil.relativedelta import relativedelta
    return fecha + relativedelta(months=meses)

def get_ndias_mes(anio, mes):
    return calendar.monthrange(anio,mes)[1]

def timestamp():
    return parse_fecha( datetime.datetime.now(), ctes.APP_FMT_FECHA_HORA )

dias_corto = [u"Lun", u"Mar", u"Mié", u"Jue", u"Vie", u"Sab", u"Dom"]
dias_largo = [u"Lunes",u"Martes",u"Miércoles",u"Jueves",u"Viernes",u"Sabado",u"Domingo"]
meses_largo = [u"Enero",
         u"Febrero",
         u"Marzo",
         u"Abril",
         u"Mayo",
         u"Junio",
         u"Julio",
         u"Agosto",
         u"Septiembre",
         u"Octubre",
         u"Noviembre",
         u"Diciembre"]
meses_corto = [u"Ene",
         u"Feb",
         u"Mar",
         u"Abr",
         u"May",
         u"Jun",
         u"Jul",
         u"Agos",
         u"Sept",
         u"Oct",
         u"Nov",
         u"Dic"]

def get_str_dia(indice):
    return dias_corto[indice]

def get_str_dia_largo(indice):
    return dias_largo[indice]

def get_str_mes_largo(indice):
    return meses_largo[indice]

def get_str_mes_corto(indice):
    return meses_corto[indice]

def hora_min_to_num(hora, minu):
    inthora = float(hora)
    intmin = float(minu)
    por_min = intmin/60.0
    val_num = inthora+por_min
    return val_num

def hora_to_num( horastr ):
    val_num = 0.0
    if horastr is not None:
        hora = horastr.strip()
        hor_min = hora.split(":")

        inthora = 0.0; intmin = 0.0
        if len(hor_min)==2:
            try:
                inthora = float(int(hor_min[0]))
            except:
                log.error("Error al tratar de obtener horas de horastr")

            try:
                intmin = float(int(hor_min[1]))
            except:
                log.error("Error al tratar de obtener minutos de horastr")

        elif len(hor_min)==1:
            try:
                inthora = float(int(hor_min[0]))
            except:
                log.error("Error al tratar de obtener horas de horastr")

        por_min = intmin/60.0
        val_num = inthora+por_min

    return val_num

def numhora_to_tupla( numhora ):
    nhoras=0
    nmin=0
    if numhora is not None:
        decimales = numhora % 1
        nmin = int(round( decimales * 60))
        nhoras = int(numhora)

    if nhoras>=24:
        nhoras=int(fabs(24-nhoras))

    return  nhoras,nmin

def num_to_hora( numhora ):
    str_hora = '00:00'
    if numhora is not None:
        decimales = numhora % 1
        nmin = int(round( decimales * 60))
        nhoras = int(numhora)
        str_hora = "{0}:{1}".format( str(nhoras).zfill(2), str(nmin).zfill(2) )
    return str_hora

def str_hora(hora, minu):
    return "{0}H{1}".format( str(hora).zfill(2), str(minu).zfill(2) )

def str_hora_ampm(hora, minu):
    return "{0}:{1} {2}".format( str(hora).zfill(2), str(minu).zfill(2), 'AM' if hora<12 else 'PM' )

def get_info_fecha_actual():
    hoy = datetime.datetime.now()
    anio = hoy.year
    mes = hoy.month
    dia = hoy.day
    return u"{0} {1} de {2} de {3}".format( get_str_dia_largo(hoy.weekday()), dia, get_str_mes_largo(mes-1), anio )

def es_fecha_menor_a(fecha_a, fecha_b):
    return fecha_a < fecha_b

def es_fecha_menor_actual(fecha_str):
    return parse_cadena(fecha_str, ctes.APP_FMT_FECHA).date() < datetime.datetime.now().date()

def es_fecha_actual_menor_a_fecha(fecha_str):
    return datetime.datetime.now().date() < parse_cadena(fecha_str, ctes.APP_FMT_FECHA).date()

def es_fecha_actual_menorigual_a_fecha(fecha_str):
    return datetime.datetime.now().date() <= parse_cadena(fecha_str, ctes.APP_FMT_FECHA).date()

def es_fecha_a_mayor_fecha_b(fecha_str_a, fecha_str_b):
    fechaa = parse_cadena(fecha_str_a, ctes.APP_FMT_FECHA)
    return fechaa.date() > parse_cadena(fecha_str_b, ctes.APP_FMT_FECHA).date()

def es_fecha_a_mayor_o_igual_fecha_b(fecha_str_a, fecha_str_b):
    fechaa = parse_cadena(fecha_str_a, ctes.APP_FMT_FECHA)
    return fechaa.date() >= parse_cadena(fecha_str_b, ctes.APP_FMT_FECHA).date()

def es_fecha_actual_mayor_a_fecha(fecha_str):
    return datetime.datetime.now().date() > parse_cadena(fecha_str, ctes.APP_FMT_FECHA).date()

def es_fecha_actual_mayorigual_a_fecha(fecha_str):
    return datetime.datetime.now().date() >= parse_cadena(fecha_str, ctes.APP_FMT_FECHA).date()

def anio_mes_dia_menor_actual(anio, mes, dia):
    fecha_str = '{0}/{1}/{2}'.format(dia,mes,anio)
    return parse_cadena(fecha_str, ctes.APP_FMT_FECHA).date() < datetime.datetime.now().date()

def get_mes(fecha):
    return fecha.month

def get_dia(fecha):
    return fecha.day

def get_anio(fecha):
    return fecha.year

def get_anio_actual():
    return get_anio(datetime.datetime.now())

def get_mes_actual():
    return get_mes(datetime.datetime.now())

def get_dia_de_la_semana(fecha):
    return fecha.weekday()+1

def get_fecha_primer_dia_del_mes(fecha):
    return parse_cadena("01-%s-%s" % (fecha.month,fecha.year ),'%d-%m-%Y')

def get_fecha_ultimo_dia_del_mes(fecha):
    return parse_cadena("%s-%s-%s" % (calendar.monthrange(fecha.year, fecha.month)[1], fecha.month,fecha.year,  ),'%d-%m-%Y')

def get_fecha_primer_dia_de_la_semana(fecha):
    diasemana =get_dia_de_la_semana(fecha)
    return sumar_dias(fecha,-(diasemana-1))

def get_fecha_ultimo_dia_de_la_semana(fecha):
    diasemana =get_dia_de_la_semana(fecha)
    return sumar_dias(fecha,(7-diasemana))

def get_now():
    """Retorna fecha actual"""
    return datetime.datetime.now()




