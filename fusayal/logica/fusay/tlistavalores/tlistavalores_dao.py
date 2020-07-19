# coding: utf-8
"""
Fecha de creacion @date
@autor: Manuel Japon
"""
from fusayal.logica.dao.base import BaseDao


class TListaValoresDao(BaseDao):

    def listar(self, codcat):
        sql = """
        select lval_id, lval_cat, lval_abrev, lval_nombre, lval_valor from tlistavalores
         where lval_cat={0} order by lval_nombre asc 
        """.format(codcat)
        tupla_desc = ('lval_id', 'lval_cat', 'lval_abrev', 'lval_nombre', 'lval_valor')
        return self.all(sql, tupla_desc)