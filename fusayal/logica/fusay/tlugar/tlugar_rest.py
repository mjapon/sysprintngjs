# coding: utf-8
"""
Fecha de creacion @date
@autor: Manuel Japon
"""
import logging

from fusayal.logica.fusay.tlugar.tlugar_dao import TLugarDao
from fusayal.utils.pyramidutil import TokenView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(collection_path='/api/tlugar', path='/api/tconsultam/{cosm_id}', cors_origins=('*',))
class TLugarRest(TokenView):

    def collection_get(self):
        lugdao = TLugarDao(self.dbsession)
        items = lugdao.listar_activos()
        return {'status': 200, 'items': items}

    def collection_post(self):
        accion = self.get_request_param('accion')
        lugdao = TLugarDao(self.dbsession)
        if accion == 'crear':
            lug_nombre = self.get_request_json_body()['lug_nombre']
            lugdao.crear(lug_nombre)
            return {'status': 200, u'msg': u'Creado exitósamente'}
        elif accion == 'actualizar':
            jsonbody = self.get_request_json_body()
            lug_id = jsonbody['lug_id']
            lug_nombre = jsonbody['lug_nombre']
            lugdao.actualizar(lug_id, lug_nombre)
            return {'status': 200, u'msg': u'Actualizado exitósamente'}
        elif accion == 'eliminar':
            jsonbody = self.get_request_json_body()
            lug_id = jsonbody['lug_id']
            lugdao.dar_de_baja(lug_id)
            return {'status': 200, u'msg': u'Se dió de baja exitósiamente'}
