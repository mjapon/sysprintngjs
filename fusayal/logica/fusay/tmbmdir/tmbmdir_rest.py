# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging
from cornice.resource import resource

from fusayal.logica.fusay.tmbmdir.tmbmdir_dao import TMiembroDirDao
from fusayal.utils.pyramidutil import FusayPublicView

log = logging.getLogger(__name__)

@resource(collection_path='/api/fusay/miembrodir', path='/api/fusay/miembrodir/{idm}',  cors_origins=('*',))
class TMiembroDirRest(FusayPublicView):

    def collection_get(self):
        log.info("Entra en collection get------------------------>")
        accion = self.get_request_param('accion')
        if 'btipo' == accion:
            tipo = self.get_request_param('tipo')
            miembrodirdao = TMiembroDirDao(self.dbsession)
            res = miembrodirdao.getByTipo(tipo)
            return {'status':200, 'item':res}
            
        return {'status':201, 'msg':'No se ha definido el parametro accion', 'item':{}}
