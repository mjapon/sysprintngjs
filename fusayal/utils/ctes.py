# -*- coding:UTF-8 -*-
"""
Created on '01/12/2014'
@author: 'Manuel'
"""
import logging

log = logging.getLogger(__name__)

IP_REDIS_SERVER = "localhost"
APP_FMT_FECHA = "%d/%m/%Y"
APP_FMT_FECHA_GMAIL = "%y/%m/%d"
APP_FMT_HORA = "%H:%M"
APP_FMT_FECHA_HORA = APP_FMT_FECHA + ' ' + APP_FMT_HORA
APP_FMT_FECHA_DB = "%Y-%m-%d"
MONEDA = "DOLAR"
MOTIVO_NC = u"DEVOLUCIÓN"
IVA = 0.12
NDECIMALESPRECIOS_VIEW = 4
NDECIMALESPRECIOS_DB = 6


def GET_APP_DOMINIO(request):
    settings = {}
    try:
        settings = request.registry.settings
    except:
        log.error(u"Error al tratar de obtener settings desde request", exc_info=True)

    app_dominio = 'localhost'
    if 'app.dominio' in settings:
        app_dominio = settings['app.dominio']

    return app_dominio


def GET_MODO_LOGOUT_ISYPLUS2(request):
    app_withnginx = 0  # Indica si la aplicacion esta siendo servida por nginx en ese caso la url de la app es /v2

    settings = {}
    try:
        settings = request.registry.settings
    except:
        log.error(u"Error al tratar de obtener settings desde request", exc_info=True)

    if 'app.isnginx' in settings:
        try:
            app_withnginx = int(settings['app.isnginx'])
        except:
            log.error("Error al tratar de parsear a int app.isnginx", exc_info=True)

    return 2 if app_withnginx == 1 else 1


# MODO_LOGOUT_ISYPLUS2 = 1#1-DESARROLLO 2-PRODUCCION
MODO_LOGOUT_DESARROLLO = 1
MODO_LOGOUT_PRODUCCION = 2
APP_CONTABLE_URL = 'v2'
# APP_DOMINIO = 'localhost'
# APP_DOMINIO = '192.168.0.12'
# APP_DOMINIO = 'www.isyplus.com'

# MODULOS DE REPORTES
MODULOS_REPORTES_DICT = {1: 'CONTABILIDAD',
                         2: 'REFERENTES',
                         3: 'MODULO'}
