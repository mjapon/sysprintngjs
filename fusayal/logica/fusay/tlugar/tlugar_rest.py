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
        items = lugdao.listar()
        return {'status':200, 'items': items}
