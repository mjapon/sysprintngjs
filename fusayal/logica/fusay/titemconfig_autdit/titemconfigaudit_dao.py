# coding: utf-8
"""
Fecha de creacion 4/4/20
@autor: mjapon
"""
import logging
from datetime import datetime

from psycopg2._psycopg import Decimal

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.titemconfig_autdit.titemconfigaudit_model import TItemConfigAudit

log = logging.getLogger(__name__)


class TItemConfigAuditDao(BaseDao):

    def crear_audit_precio(self, ic_id, user_crea, sec_id, val_antes, val_despues):
        titemconfigaudit = TItemConfigAudit()
        titemconfigaudit.user_crea = user_crea
        titemconfigaudit.fecha_crea = datetime.now()
        titemconfigaudit.sec_id = sec_id
        titemconfigaudit.ic_id = ic_id
        titemconfigaudit.ica_tipo = 'P'
        titemconfigaudit.ica_valantes = Decimal(val_antes)
        titemconfigaudit.ica_valdespues = Decimal(val_despues)

        self.dbsession.add(titemconfigaudit)

    def crear_audit_stock(self, ic_id, user_crea, sec_id, val_antes, val_despues):
        titemconfigaudit = TItemConfigAudit()
        titemconfigaudit.user_crea = user_crea
        titemconfigaudit.fecha_crea = datetime.now()
        titemconfigaudit.sec_id = sec_id
        titemconfigaudit.ic_id = ic_id
        titemconfigaudit.ica_tipo = 'S'
        titemconfigaudit.ica_valantes = Decimal(val_antes)
        titemconfigaudit.ica_valdespues = Decimal(val_despues)

        self.dbsession.add(titemconfigaudit)
