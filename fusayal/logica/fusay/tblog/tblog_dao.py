# coding: utf-8
"""
Fecha de creacion 27/02/2020
@autor: mejg231019
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class TBlogDao(BaseDao):

    def listar(self):
        sql = """select blg_id, blg_fecha, blg_autor, blg_titulo, 
        blg_img, blg_fechacrea, blg_contenido from tblog order by blg_fechacrea desc"""

        tupla_desc = ('blg_id', 'blg_fecha', 'blg_autor', 'blg_titulo',
        'blg_img', 'blg_fechacrea', 'blg_contenido')

        return self.all(sql, tupla_desc)

    def get_byid(self, blg_id):
        sql = """select blg_id, blg_fecha, blg_autor, blg_titulo, 
                blg_img, blg_fechacrea, blg_contenido from tblog where blg_id = {0} order by blg_fechacrea desc""".format(blg_id)

        tupla_desc = ('blg_id', 'blg_fecha', 'blg_autor', 'blg_titulo',
                      'blg_img', 'blg_fechacrea', 'blg_contenido')

        return self.first(sql, tupla_desc)