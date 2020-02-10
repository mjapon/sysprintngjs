# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao


class TFusayLugarEvDao(BaseDao):

    def listar(self):
        sql = "select lugc_id, lugc_nombre from tlugarev order by lugc_id"
        tupla_desc = ('lugc_id', 'lugc_nombre')
        return self.all(sql, tupla_desc)
