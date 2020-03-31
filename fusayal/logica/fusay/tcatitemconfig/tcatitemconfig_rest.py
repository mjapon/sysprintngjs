# coding: utf-8
"""
Fecha de creacion 3/11/20
@autor: mjapon
"""
import logging

from fusayal.logica.fusay.tcatitemconfig.tcatitemconfig_dao import TCatItemConfigDao
from fusayal.utils.pyramidutil import TokenView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(collection_path='/api/categorias', path='/api/categorias/{cat_id}', cors_origins=('*',))
class TCatItemConfigRest(TokenView):

    def collection_get(self):
        catdao = TCatItemConfigDao(self.dbsession)
        res = catdao.listar()
        return {'items': res, 'status': 200}

