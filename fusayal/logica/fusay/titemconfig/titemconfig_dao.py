# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tgrid.tgrid_dao import TGridDao

log = logging.getLogger(__name__)


class TItemConfigDao(BaseDao):

    def listar(self):
        tgrid_dao = TGridDao(self.dbsession)
        data = tgrid_dao.run_grid(grid_nombre='productos', where="1=1", order='ic_nombre')
        return data
