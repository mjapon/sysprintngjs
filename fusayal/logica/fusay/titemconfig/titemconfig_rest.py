# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging

from fusayal.logica.fusay.tcatitemconfig.tcatitemconfig_dao import TCatItemConfigDao
from fusayal.logica.fusay.titemconfig.titemconfig_dao import TItemConfigDao
from fusayal.utils.pyramidutil import FusayPublicView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(collection_path='/api/titemconfig', path='/api/titemconfig/{ic_id}', cors_origins=('*',))
class TItemConfigRest(FusayPublicView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        titemconfig_dao = TItemConfigDao(self.dbsession)
        if 'listar' == accion:
            data = titemconfig_dao.listar()
            return {'status': 200, 'data': data}
        elif 'formcrea' == accion:
            form = titemconfig_dao.get_form()
            tcaticdao = TCatItemConfigDao(self.dbsession)
            categorias = tcaticdao.listar()
            return {'status': 200, 'form': form, 'cats':categorias}
        else:
            return {'status': 404, 'msg': 'accion desconocida'}
