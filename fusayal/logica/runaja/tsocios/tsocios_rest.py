# coding: utf-8
"""
Fecha de creacion 8/27/19
@autor: mjapon
"""
import logging

from fusayal.logica.runaja.tsocios.tsocios_dao import TSociosDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource

log = logging.getLogger(__name__)

@resource(path="/rest/tsocios/{soc_id}", collection_path="/rest/tsocios")
class TSociosRest(DbComunView):

    def collection_get(self):
        self.change_dbschema('runaja')
        tsocios_dao = TSociosDao(self.dbsession)
        accion = self.get_request_param('accion')
        if accion is None:
            return {'estado':202,'msg':'Ninguna accion realizada, el parametro accion es requerido'}
        else:
            if accion == 'login':
                soc_id = self.get_request_param('soc_id')
                clave = self.get_request_param('soc_clave')
                autenticado = tsocios_dao.autenticar(user_id=soc_id, user_pass=clave)
                if autenticado:
                    return {'estado':200, 'msg':u'Autenticación exitosa'}
                else:
                    return {'estado':201, 'msg':u'Login Fallido'}
