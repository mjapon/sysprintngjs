# coding: utf-8
"""
Fecha de creacion @date
@autor: Manuel Japon
"""
import logging

from fusayal.logica.fusay.tlistavalores.tlistavalores_dao import TListaValoresDao
from fusayal.utils.pyramidutil import TokenView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(collection_path='/api/tlistavalores', path='/api/tlistavalores/{lval_id}', cors_origins=('*',))
class TListaValoresRest(TokenView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        if accion == 'ctgs':
            cat = self.get_request_param('cat')
            listavaloresdao = TListaValoresDao(self.dbsession)
            res = listavaloresdao.listar(codcat=cat)
            return {'status': 200, 'items': res}
