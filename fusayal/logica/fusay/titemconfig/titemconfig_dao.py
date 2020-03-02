# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tgrid.tgrid_dao import TGridDao
from fusayal.logica.fusay.titemconfig.titemconfig_model import TItemConfig

log = logging.getLogger(__name__)


class TItemConfigDao(BaseDao):

    def listar(self):
        tgrid_dao = TGridDao(self.dbsession)
        data = tgrid_dao.run_grid(grid_nombre='productos', where="1=1", order='ic_nombre')
        return data

    def get_form(self):
        formic = {
            'ic_nombre': '',
            'ic_code': '',
            'tipic_id': 1,
            'ic_nota': '',
            'catic_id': ''
        }

        formdatosprod = {
            'dprod_grabaiva': True,
            'dprod_grabaimpserv': False,
            'dprod_preciocompra': 0.0,
            'dprod_precioventa': 0.0,
            'dprod_existencias': 0,
            'dprod_proveedor': -2,
            'dprod_modcontab': 0
        }

        return {
            'formic': formic,
            'formdatosprod': formdatosprod
        }

    def crear(self, form):
        """
        Para registrar un producto se requiere:
        1. Regitrar en titemconfig

        :return:
        """

        datositemconfig = form['formic']
        datosprod = form['formdatosprod']

        itemconfig = TItemConfig()








