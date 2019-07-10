# -*- coding:UTF-8 -*-
"""
Created on '02/12/2014'
@author: 'Manuel'
"""
import logging
from pyramid.exceptions import Forbidden
from pyramid.httpexceptions import HTTPFound
import simplejson
from sqlalchemy.engine import create_engine
from sqlalchemy.orm.scoping import scoped_session
from sqlalchemy.orm.session import sessionmaker
from zope.sqlalchemy.datamanager import ZopeTransactionExtension

#from fusayal.models.conf import get_dbsession_comun
from fusayal.utils.jsonutil import SimpleJsonUtil

log = logging.getLogger(__name__)

ENGINES_EMP_DIC = {}




class PyramidView(SimpleJsonUtil):

    def __init__(self, request, context=None):
        self.request = request
        self.ruta = self.request.path
        self.form = None
        self.dbsession = None
        if 'dbsession' in dir(self.request):
            self.dbsession = self.request.dbsession
        #self.conf_dbsession()
        self.init()

    def verif_dbsession(self):
        pass
        """
        if 'dbsession' in dir(self):
            if self.dbsession.closed:
        """

    def get_json_body(self):
        """
        Retorna json_body de la peticion
        :return:
        """
        return self.request.json_body

    """
    def conf_dbsession(self):
        pass
    """

    def init(self):
        pass

    def default(self):
        pass

    def flash(self, msg):
        self.request.session.flash(msg)

    def _tomar_datos(self):
        if self.form:
            for campo in self.request.params:
                self.form.__dict__[campo] = self.request.params[campo]

    def _ejecutar_accion(self):
        if 'submit' in self.request.params:
            accion = self.request.params['submit']
            if accion in dir(self):
                return getattr(self, accion)()
            else:
                return self.default()

    def reload_page(self, **kwargs):
        """Metodo de ayuda que hace un redireccion a la misma pagina"""
        return HTTPFound(self.ruta,**kwargs)

    def route_url(self, ruta, **kwargs):
        """Metodo de ayuda para rutear entre paginas"""
        return HTTPFound(self.request.route_url(ruta, **kwargs))

    def __call__(self):
        self._tomar_datos()
        res = self._ejecutar_accion()

        return (self.__dict__ if res is None else res)

    def psession(self, key, value, sobresc=True):
        """Pone un valor en la session"""
        if sobresc:
            self.request.session[key] = value
        elif key not in self.request.session:
            self.request.session[key] = value

    def gsession(self, key):
        """Retorna un valor de la session"""
        return self.request.session[key]

    def rsession(self, key):
        """Borra un valor de session"""
        if key in self.request.session:
            del(self.request.session[key])

    def get_request_param(self, param):
        """
        Busca en request.params parametro con nombre especificado en param y lo retorna, si no existe retorna None
        :param param:
        :return: request.params[param] o None
        """
        if param in self.request.params:
            return self.request.params[param]
        return None

    def get_request_params(self):
        """
        Rertora todo el objeto request.params
        :return: request.params
        """
        return self.request.params

    def get_request_matchdict(self, clave):
        return self.request.matchdict[clave]

    def get_request_json_body(self):
        return self.request.json_body


class DbComunView(PyramidView):
    """
    def conf_dbsession(self):
        self.dbsession = get_dbsession_comun(self.request.registry.settings)
    """

    def get_userid(self):
        if 'us_id' in self.request.session:
            return self.request.session['us_id']
        return None



