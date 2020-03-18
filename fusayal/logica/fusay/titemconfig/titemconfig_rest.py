# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging

from fusayal.logica.fusay.tcatitemconfig.tcatitemconfig_dao import TCatItemConfigDao
from fusayal.logica.fusay.titemconfig.titemconfig_dao import TItemConfigDao
from fusayal.utils.pyramidutil import FusayPublicView, TokenView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(collection_path='/api/titemconfig', path='/api/titemconfig/{ic_id}', cors_origins=('*',))
class TItemConfigRest(TokenView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        titemconfig_dao = TItemConfigDao(self.dbsession)
        if 'listar' == accion:
            filtro = self.get_request_param('filtro')
            data = titemconfig_dao.listar(filtro)
            return {'status': 200, 'data': data}
        elif 'formcrea' == accion:
            form = titemconfig_dao.get_form()
            tcaticdao = TCatItemConfigDao(self.dbsession)
            categorias = tcaticdao.listar()
            return {'status': 200, 'form': form, 'cats': categorias}
        else:
            return {'status': 404, 'msg': 'accion desconocida'}

    def post(self):
        titemconfig_dao = TItemConfigDao(self.dbsession)
        form = self.get_json_body()
        ic_id = titemconfig_dao.crear(form, self.get_user_id())
        return {'status': 200, 'msg': 'Registrado exitosamente', 'ic_id': ic_id}
