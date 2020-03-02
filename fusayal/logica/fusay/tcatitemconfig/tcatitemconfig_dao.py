# coding: utf-8
"""
Fecha de creacion 2/17/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class TCatItemConfigDao(BaseDao):

    def listar(self):
        sql = "select catic_id, catic_nombre from tcatitemconfig order by catic_id";
        tupla = ('catic_id', 'catic_nombre')
        return self.all(sql, tupla)
