# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""

import logging

from cornice.resource import resource

from fusayal.logica.jobs.reprint.jobrp_dao import TJobReprintDao
from fusayal.utils.pyramidutil import DbComunView

log = logging.getLogger(__name__)


@resource(path="/rest/jobrp/{jobrp_id}", collection_path="/rest/jobrp")
class TJobReprintRest(DbComunView):

    def post(self):
        jobrp_id = int(self.get_request_matchdict('jobrp_id'))
        tjobreprintdao = TJobReprintDao(self.dbsession)
        if jobrp_id == 0:
            tjobreprintdao.crear(form=self.get_json_body(), user_crea=self.get_userid())
            return {'estado': 200, 'msg': 'Registro exitoso'}
