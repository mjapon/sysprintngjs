# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging
import json

import simplejson

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class TGridDao(BaseDao):

    def get_metadata_grid(self, grid_nombre):
        sql = """
        select grid_id, grid_nombre, grid_basesql, grid_columnas, grid_tupladesc from tgrid
            where grid_nombre ='{0}'
        """.format(grid_nombre)

        tupla_desc = ('grid_id', 'grid_nombre', 'grid_basesql', 'grid_columnas', 'grid_tupladesc')

        return self.first(sql, tupla_desc)

    def run_grid(self, grid_nombre, **params):

        metadata_grid = self.get_metadata_grid(grid_nombre)

        grid_basesql = metadata_grid['grid_basesql']
        sgrid_columnas = metadata_grid['grid_columnas']
        sgrid_tupladesc = metadata_grid['grid_tupladesc']

        tupla_desc = tuple(simplejson.loads(sgrid_tupladesc))
        cols = simplejson.loads(sgrid_columnas)

        sql = grid_basesql.format(**params)

        data = self.all(sql,tupla_desc)
        return {'data':data, 'cols':cols}

