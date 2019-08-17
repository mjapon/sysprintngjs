# -*- coding:UTF-8 -*-
"""
Created on '04/03/2015'
@author: 'Manuel'
"""
import json
import logging
from pyramid.response import Response
#from pyramid.view import view_config, exception_view_config
from fusayal.utils.jsonutil import SEJsonEncoder
from pyramid.view import view_config

log = logging.getLogger(__name__)


def procesar_excepcion(exc, request):
    emp_codigo = 0
    """
    try:
        if 'emp_codigo' in request.session:
            emp_codigo = int(request.session["emp_codigo"])
    except:
        log.error(u"Exception capturada, no pude recuperar el codigo de la empresa", exc_info=True)
    """

    log.error(' Exception capturada: ', exc_info=True)
    log.error(' Empresa donde se genera el error es: {0} '.format(emp_codigo))

    # msg = unicode(exc.message, errors='ignore')
    msg = exc.message
    inputid = ""
    if 'inputid' in dir(exc):
        inputid = exc.inputid

    status_code = None
    if 'status_code' in dir(exc):
        status_code = exc.status_codex
    if status_code is None:
        status_code = 400  # Bad request

    error_code = None
    if 'error_code' in dir(exc):
        error_code = exc.error_code
    if error_code is None:
        error_code = status_code

    ss_expirada = 0

    # if emp_codigo == 0:
    #     ss_expirada = 1

    return {
        'msg': msg,
        'inputid': inputid,
        'status_code': status_code,
        'error_code': error_code,
        'ss_expirada': ss_expirada
    }


def add_status_to_response(response, exc_res):
    response.status_code = exc_res.get("status_code", 200)
    return response

@view_config(context=Exception, renderer='excepcion/general.html')
def exc_general(exc, request):
    res = procesar_excepcion(exc, request)
    response = Response(json.dumps(res, cls=SEJsonEncoder))
    return add_status_to_response(response, res)

