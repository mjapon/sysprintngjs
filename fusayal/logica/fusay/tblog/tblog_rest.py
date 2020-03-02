# coding: utf-8
"""
Fecha de creacion 27/02/2020
@autor: mejg231019
"""
import logging


from cornice.resource import resource

from fusayal.logica.fusay.tblog.tblog_dao import TBlogDao
from fusayal.utils.pyramidutil import FusayPublicView

log = logging.getLogger(__name__)


@resource(collection_path="/api/tblog", path="/api/tblog/{blg_id}", cors_origins=('*',))
class TBlogRest(FusayPublicView):

    def collection_get(self):
        log.info("Tblog rest collection get")
        tblogdao = TBlogDao(self.dbsession)
        result = tblogdao.listar()
        return {'status': 200, 'items': result}

    def get(self):
        blg_id = self.get_request_matchdict('blg_id')
        tblogdao = TBlogDao(self.dbsession)
        result = tblogdao.get_byid(blg_id)
        if result is not None:
            return {'status': 200, 'item': result}
        else:
            return {'status': 404}
