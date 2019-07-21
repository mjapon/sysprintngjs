# coding: utf-8
"""
Fecha de creacion 7/20/19
@autor: mjapon
"""
import logging

from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource

log = logging.getLogger(__name__)

@resource(path="/rest/audit/{aut_id}", collection_path="/rest/audit")
class AuditRest(DbComunView):
    
    def post(self):
        aut_id = self.get_request_matchdict("aut_id")
        if aut_id is not None:
            aut_id = int(aut_id)

        taudao = TAuditDao(self.dbsession)
        if int(aut_id) == 0:
            form = self.get_json_body()
            taudao.crea_acceso_log_audit(temp_id=form['temp_id'], user_acces=self.get_userid())
            return {'estado': 200, 'msg': 'Registro exitoso'}
        else:
            return {'estado': 200, 'msg': 'Ninguna accion realizada'}
    
    
