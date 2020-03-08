# coding: utf-8
"""
Fecha de creacion 3/7/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class TSeccionDao(BaseDao):

    def listar(self):
        sql ="select sec_id, sec_nombre from tseccion where  sec_estado = 1 order by sec_id"
        tupla_desc = ('sec_id','sec_nombre')
        return self.all(sql, tupla_desc)

    def get_byid(self, sec_id):
        sql = "select sec_id, sec_nombre from tseccion where  sec_estado = 1 and sec_id ={0} order by sec_id".format(sec_id)
        tupla_desc = ('sec_id', 'sec_nombre')
        return self.first(sql, tupla_desc)