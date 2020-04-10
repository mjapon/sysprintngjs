# coding: utf-8
"""
Fecha de creacion 4/4/20
@autor: mjapon
"""
import logging

from cornice.resource import resource

from fusayal.logica.fusay.titemconfig_stock.titemconfigstock_dao import TItemConfigStockDao
from fusayal.utils.pyramidutil import TokenView

log = logging.getLogger(__name__)


@resource(collection_path="/api/titemconfigsotck", path="/api/titemconfigstock/{ice_id}", cors_origins=('*',))
class TItemConfigStockRest(TokenView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        if accion == 'form':
            ic_id = self.get_request_param('ic_id')
            titemconfigstock_dao = TItemConfigStockDao(self.dbsession)
            form_secs = titemconfigstock_dao.get_stock(ic_id=ic_id)
            return {'status': 200, 'form_secs': form_secs}
        else:
            return {'status': 4040, 'msg': u'Ninguna acción especificada'}

    def collection_post(self):
        accion = self.get_request_param('accion')
        if accion == 'guardar':
            form = self.get_request_json_body()
            titemconfigstock_dao = TItemConfigStockDao(self.dbsession)
            titemconfigstock_dao.crear_actualizar(form_secs=form, user_do=self.get_user_id())
            return {'status': 200, 'msg': u'Operación Exitosa'}
        else:
            return {'status': 404, 'msg': u'Ninguna acción especificada'}
