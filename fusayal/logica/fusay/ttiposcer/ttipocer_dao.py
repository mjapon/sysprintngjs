# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)




class TFusayTipEventDao(BaseDao):

    def listar(self):
        sql = "select tiev_id, tiev_nombre from ttipoev order by tiev_id"
        tupla_desc = ('tiev_id', 'tiev_nombre')
        return self.all(sql, tupla_desc)
