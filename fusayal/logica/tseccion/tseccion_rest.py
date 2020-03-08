# coding: utf-8
"""
Fecha de creacion 3/7/20
@autor: mjapon
"""
import logging

from fusayal.logica.tseccion.tseccion_dao import TSeccionDao
from fusayal.utils.pyramidutil import TokenView
from cornice.resource import resource
from fusayal.logica.utils.generatokenutil import GeneraTokenUtil

log = logging.getLogger(__name__)


@resource(collection_path='/api/tseccion', path='/api/tseccion/{sec_id}', cors_origins=('*',))
class TSeccionRest(TokenView):

    def collection_get(self):
        secdao = TSeccionDao(self.dbsession)
        secs = secdao.listar()
        return {'status': 200, 'items': secs}

    def collection_post(self):
        accion = self.get_request_param('accion')
        if accion == 'setseccion':
            form = self.get_json_body()
            sec_id = form['sec_id']
            auth_token = self.request.headers['x-authtoken']
            genera_token_util = GeneraTokenUtil()

            secdao = TSeccionDao(self.dbsession)
            seccion = secdao.get_byid(sec_id)
            token = genera_token_util.update_secid_token(token=auth_token, sec_id=sec_id)
            return {'status': 200, 'token': token, 'seccion':seccion}
