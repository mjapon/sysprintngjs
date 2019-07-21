# coding: utf-8
"""
Fecha de creacion @date
@autor: Manuel Japon
"""
import datetime

from fusayal.logica.auditorias.taudit_model import TAudit
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.utils import enums
from fusayal.logica.utils.enums import TBL_JOBDOC, TBL_PLANTILLAS


class TAuditDao(BaseDao):

    def crear(self, tbl_id,
              aud_accion,
              aud_userid,
              aud_campo,
              aud_valorant,
              aud_valordesp,
              aud_obs,
              aud_codreg):
        taudit = TAudit()
        taudit.aud_fechahora = datetime.datetime.now()

        taudit.tbl_id = tbl_id
        taudit.aud_campo = aud_campo
        taudit.aud_accion = aud_accion
        taudit.aud_userid = aud_userid
        taudit.aud_valorant = aud_valorant
        taudit.aud_valordesp = aud_valordesp
        taudit.aud_obs = aud_obs
        taudit.aud_codreg = aud_codreg

        self.dbsession.add(taudit)

    def crea_accion_insert(self, tbl_id,
                           aud_userid, codreg):
        self.crear(tbl_id=tbl_id, aud_accion=enums.INSERT_ACTION, aud_userid=
        aud_userid, aud_campo='', aud_valorant='', aud_valordesp='', aud_obs="", aud_codreg=codreg)

    def crea_accion_update(self, tbl_id,
                           aud_campo,
                           aud_userid,
                           aud_valorant,
                           aud_valordesp,
                           codreg,
                           aud_obs=''):
        self.crear(tbl_id=tbl_id, aud_accion=enums.UPDATE_ACTION, aud_userid=
        aud_userid, aud_campo=aud_campo, aud_valorant=aud_valorant, aud_valordesp=aud_valordesp, aud_obs=aud_obs,
                   aud_codreg=codreg)

    def crea_accion_delete(self, tbl_id,
                           aud_campo,
                           aud_userid,
                           aud_valorant,
                           aud_valordesp,
                           codreg):
        self.crear(tbl_id=tbl_id, aud_accion=enums.DELETE_ACTION, aud_userid=
        aud_userid, aud_campo=aud_campo, aud_valorant=aud_valorant, aud_valordesp=aud_valordesp, aud_obs="",
                   aud_codreg=codreg)

    def crea_acceso_log_audit(self, temp_id, user_acces):
        self.crear(tbl_id=TBL_PLANTILLAS, aud_accion=enums.ACCEDELOG_ACTION, aud_userid=user_acces,
                   aud_campo="", aud_valorant="", aud_valordesp="",
                   aud_codreg=temp_id, aud_obs="")
