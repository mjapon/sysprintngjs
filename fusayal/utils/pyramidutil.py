# -*- coding:UTF-8 -*-
"""
Created on '02/12/2014'
@author: 'Manuel'
"""
import logging

from fusayal.logica.excepciones.validacion import UnauthorizedExc
from pyramid.exceptions import Forbidden
from pyramid.httpexceptions import HTTPFound
import simplejson
from sqlalchemy.engine import create_engine
from sqlalchemy.orm.scoping import scoped_session
from sqlalchemy.orm.session import sessionmaker
from zope.sqlalchemy.datamanager import ZopeTransactionExtension

#from fusayal.models.conf import get_dbsession_comun
from fusayal.logica.utils.generatokenutil import GeneraTokenUtil
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
    def init(self):
        if 'emp_esquema' in self.request.session:
            esquema_emp =self.request.session['emp_esquema']
            print 'DBCOMUNVIEW se setea en {0}'.format(esquema_emp)
            self.request.dbsession.execute("SET search_path TO {0}".format(esquema_emp))

    def change_dbschema(self, emp_esquema):
        print 'DBCOMUNVIEW se setea en {0}'.format(emp_esquema)
        self.request.dbsession.execute("SET search_path TO {0}".format(emp_esquema))

    def get_userid(self):
        if 'us_id' in self.request.session:
            return self.request.session['us_id']
        return None


class TokenView(PyramidView):
    """
    Clase para implementar autenticacion basada en token, en la cabecera de la peticion debe venir
    el codigo de la empresa, el esquema de la empresa y el token de autenticacion
    """
    def init(self):

        """
        if 'token' not in self.request.headers \
                or 'emp_esquema' not in self.request.headers \
                or 'auth_token' not in self.request.headers:
            raise UnauthorizedExc("No autenticado")
        """
        if self.request.method == 'OPTIONS':
            # Http OPTIONS parsed avoid this request
            pass
        else:
            self.conf_dbsession()

    def change_dbschema(self, emp_esquema):
        print 'DBCOMUNVIEW se setea en {0}'.format(emp_esquema)
        self.request.dbsession.execute("SET search_path TO {0}".format(emp_esquema))

    def conf_dbsession(self):
        if 'x-authtoken' not in self.request.headers:
            raise UnauthorizedExc("No autenticado")

        auth_token = self.request.headers['x-authtoken']

        # TODO: Codigo para verificar si token ya ha expirado

        genera_token_util = GeneraTokenUtil()
        datostoken =  genera_token_util.get_datos_fromtoken(auth_token)

        self.emp_codigo = datostoken['emp_codigo']
        self.emp_esquema = datostoken['emp_esquema']
        self.user_id = datostoken['us_id']
        self.sec_id = datostoken['sec_id']

        print "Seccion en el token es:"+ str(self.sec_id)

        self.change_dbschema(self.emp_esquema)

    """
    def conf_dbsession(self):
        if 'emp_codigo' not in self.request.headers \
                or 'emp_esquema' not in self.request.headers \
                or 'auth_token' not in self.request.headers:
            raise UnauthorizedExc("No autenticado")

        self.emp_codigo = self.request.headers['emp_codigo']
        self.emp_esquema = self.request.headers['emp_esquema']
        self.num_user = self.request.headers['num_user']
        self.auth_token = self.request.headers['auth_token']

        #TODO: Codigo para verificar si token ya ha expirado

        #self.dbsession = get_dbsession_emp(self.emp_codigo, self.emp_esquema)
    """

    def get_user_id(self):
        return self.user_id

    def get_emp_codigo(self):
        return self.emp_codigo

    def get_emp_esquema(self):
        return self.emp_esquema

    def get_sec_id(self):
        return self.sec_id



class FusayPublicView(PyramidView):
    """
    Clase que implementa consultas publicas, no requieren de autenticacion previa
    """

    def init(self):

        """
        if 'token' not in self.request.headers \
                or 'emp_esquema' not in self.request.headers \
                or 'auth_token' not in self.request.headers:
            raise UnauthorizedExc("No autenticado")
        """
        self.emp_esquema = 'fusay'
        if self.request.method == 'OPTIONS':
            # Http OPTIONS parsed avoid this request
            pass
        else:
            self.request.dbsession.execute("SET search_path TO {0}".format(self.emp_esquema))






