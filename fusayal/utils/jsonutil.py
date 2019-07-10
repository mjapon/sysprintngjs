# -*- coding:UTF-8 -*-
"""
Created on '02/12/2014'
@author: 'Manuel'
"""
from decimal import Decimal
import json
import logging
import datetime
import simplejson

from fusayal.utils import ctes
from fusayal.utils.fechas import parse_fecha

log = logging.getLogger(__name__)


def obj_to_json(obj):
    if isinstance(obj, datetime.datetime):
        obj = parse_fecha(obj, ctes.APP_FMT_FECHA_HORA)
    elif isinstance(obj, datetime.date):
        obj = parse_fecha(obj, ctes.APP_FMT_FECHA)
    elif isinstance(obj, datetime.time):
        obj = parse_fecha(obj, ctes.APP_FMT_HORA)
    elif isinstance(obj, Decimal):
        obj = float(str(obj))
    elif isinstance(obj, int):
        obj = obj
    elif isinstance(obj, float):
        obj = obj
    elif '__json__' in dir(obj):
        obj = getattr(obj, '__json__')()
    elif isinstance(obj, tuple):
        resobj={}; i=0
        for ti in obj:
            resobj[i] = str(ti); i+=1
        obj = resobj
    elif isinstance(obj,list):
        obj = obj
    else:
        obj = unicode(obj) if obj is not None else ''

    return obj


def tupla_to_json(tupla):
    jsondict = {}
    if tupla is not None:
        for i in range(len(tupla)):
            jsondict[i]=obj_to_json(tupla[i])
    return jsondict


class SimpleJsonUtil(object):
    def dict_to_type(self, dictdata, obj):
        for kk in dictdata:
            obj.__dict__[kk] = dictdata[kk]
        return obj

    def type_json(self, val):
        return obj_to_json(val)

    def json_to_type(self, json, obj):
        dd = self.obj(json)
        for kk in dd:
            obj.__dict__[kk] = dd[kk]
        return obj

    def tupla_to_json(self, tupla, tupladesc=None):
        jsondict = {}
        if tupla is not None:
            for i in range(len(tupla)):
                jsondict[ tupladesc[i] if tupladesc else i ]=obj_to_json(tupla[i])

        return jsondict

    def make_json_list(self, res, tupla_desc):
        return [self.tupla_to_json(tupla, tupla_desc) for tupla in res]

    def json(self, obj):
        """Retorna una representacion json del objeto"""
        dd = {}
        if '__json__' in  dir(obj):
            dd = obj.__json__()
        else:
            dd = obj.__dict__

        res = simplejson.dumps(  dd )
        return res

    def dumps(self, obj):
        """
        Convierte un objeto de python en una representacion json cadena de texto
        :param obj: un objeto de pyhon
        :return: Cadena de texto
        """
        return simplejson.dumps(obj)

    def obj(self, jsoncad):
        """Retorna dado una cadena json a un dicciorio de python """
        return simplejson.loads(jsoncad)

    def dict_to_json(self, dd):
        """Retorna dado un dicionario a una representacion en json"""
        dd_json = {}
        for key in dd:
            dd_json[key] = self.type_json(dd[key])

        return dd_json

    def mixin_json(self, from_json, to_json):
        """Copia los valores de el diccionario from_json en to_json, sobreescribe clave si existe en to_json"""
        for key in from_json.keys():
            to_json[key] = from_json[key]

        return to_json


class JsonAlchemy(object):
    """Clase utilitaria que serializa una Entidad SQLAlchemy a formato JSON"""
    def __json__(self, request=None):
        jsondict = {}
        columns = self.__table__.columns
        for c in columns:
            val = getattr(self, c.name)
            jsondict[c.name] = obj_to_json(val)
        return jsondict


class JsonPyramid( object ):
    """Clase utilitaria que serializa un objeto a formato JSON"""
    def __json__(self, request=None):
        atrlist = self.__dict__.keys()
        jsondict = {}
        #Leer valor del atributo
        if atrlist:
            for atr in atrlist:
                val = self.__dict__[atr]
                jsondict[atr] = obj_to_json(val)
        return jsondict


class SEJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        return obj_to_json(obj)