# -*- coding:UTF-8 -*-
"""
Created on '01/12/2014'
@author: 'Manuel'
"""
import logging
import time

from pyramid.events import subscriber, BeforeRender

from fusayal.utils import fechas, ctes

log = logging.getLogger(__name__)


@subscriber(BeforeRender)
def add_global(event):
    req = event['request']
    event['fecha'] = fechas.get_info_fecha_actual()

    if req is not None:
        event['modoDespligeApp'] = "{0}".format(ctes.GET_MODO_LOGOUT_ISYPLUS2(req))
        event['vapp'] = str(time.time())
        event['emp_codigo'] = 0
        event['emp_esquema'] = 0
        event['alm_codigo'] = 0
        event['num_user'] = 0

        event['user_logged'] = 0
        if 'us_id' in req.session:
            event['user_logged'] = req.session['us_id']

            # if verificar_datos_redis(req):
        #     emp_codigo = req.session['emp_codigo']
        #     num_user = req.session['num_user']
        #     alm_codigo = req.session['alm_codigo']
        #     sec_codigo = req.session['sec_codigo']
        #     tdv_codigo = req.session['tdv_codigo']
        #
        #     event['emp_codigo'] = emp_codigo
        #     event['emp_esquema'] = req.session['emp_esquema']
        #     event['alm_codigo'] = alm_codigo
        #     event['num_user'] = num_user
        #     event['sec_codigo'] = sec_codigo
        #     event['tdv_codigo'] = tdv_codigo
        #
        #     print_local = 0
        #     if 'tipo_print_local' in req.session:
        #         print_local = req.session['tipo_print_local']
        #
        #     key_redis_base = "ee:{0}:ss:{1}".format(emp_codigo, num_user)
        #     key_redis_emp_navbar = "{0}:emp_navbar".format(key_redis_base)
        #     key_redis_ss_navbar = "{0}:ss_navbar".format(key_redis_base)
        #     key_redis_pry_navbar = "{0}:pry_navbar".format(key_redis_base)
        #     key_redis_mail_navbar = "{0}:mail_navbar".format(key_redis_base)
        #     key_redis_alm = "ee:{0}:alm:{1}".format(emp_codigo, alm_codigo)
        #     key_redis_tpdv = "ee:{0}:ss:{1}:tpdv:{2}".format(emp_codigo, num_user, tdv_codigo)
        #     key_redis_seccion = "ee:{0}:ss:{1}:tseccion:{2}".format(emp_codigo, num_user, sec_codigo)
        #
        #     sju = SimpleJsonUtil()
        #     event['empresa'] = sju.json_to_type(ru.hget("ee:{0}".format(emp_codigo), "info"), Tempresa())
        #     event['emp_navbar'] = ru.get(key_redis_emp_navbar)
        #     event['ss_navbar'] = ru.get(key_redis_ss_navbar)
        #     pry_navbar = ru.get(key_redis_pry_navbar)
        #     mail_navbar = ru.get(key_redis_mail_navbar)
        #     event['pry_navbar'] = pry_navbar if pry_navbar is not None else ''
        #     event['mail_navbar'] = mail_navbar if mail_navbar is not None else ''
        #     event['almacen'] = sju.json_to_type(ru.get(key_redis_alm), Talmacen())
        #     event['puntoemision'] = sju.json_to_type(ru.get(key_redis_tpdv), Ttpdv())
        #     try:
        #         event['tseccion'] = sju.json_to_type(ru.get(key_redis_seccion), Tseccion())
        #     except:
        #         #log.error("Error al tratar de obtener de redis el valor para tseccion", exc_info=True)
        #         event['tseccion'] = None
        #
        #     event['print_local'] = print_local
