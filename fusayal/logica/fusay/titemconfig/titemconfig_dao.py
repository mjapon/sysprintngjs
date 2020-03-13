# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tgrid.tgrid_dao import TGridDao
from fusayal.logica.fusay.titemconfig.titemconfig_model import TItemConfig
from fusayal.logica.fusay.titemconfig_meta.titemconfigmeta_model import TItemConfigMeta
from fusayal.logica.fusay.titemconfig_precios.titemconfigprecios_model import TItemConfigPrecios
from fusayal.logica.params.param_dao import ParamsDao

log = logging.getLogger(__name__)


class TItemConfigDao(BaseDao):

    def listar(self):
        tgrid_dao = TGridDao(self.dbsession)
        data = tgrid_dao.run_grid(grid_nombre='productos', where="1=1", order='ic_nombre')
        return data

    def get_prods_for_tickets(self):
        params_dao = ParamsDao(self.dbsession)
        arts_tickets = params_dao.get_param_value('artsTickets')
        sql = "select ic_id, ic_nombre, ic_code from titemconfig where ic_id in ({0})".format(arts_tickets)
        tupla_desc = ('ic_id', 'ic_nombre', 'ic_code')
        return self.all(sql, tupla_desc)

    def get_form(self):
        formic = {
            'ic_id': 0,
            'ic_nombre': '',
            'ic_code': '',
            'tipic_id': 1,
            'ic_nota': '',
            'catic_id': '',
            'ic_fechacrea': '',
            'ic_grabaiva': True,
            'ic_grabaimpserv': False,
            'icpre_preciocompra': 0.0,
            'icpre_precioventa': 0.0,
            'icm_existencias': 0,
            'icm_proveedor': -2,
            'icm_modcontab': 0,
            'icm_fechacaducidad': ''
        }

        return formic

    def crear(self, form, user_crea, sec_id):
        """
        Crea un nuevo articulo
        :param form:
        :param user_crea:
        :param sec_id:
        :return:
        """

        itemconfig = TItemConfig()
        itemconfig.ic_nombre = form['ic_nombre']
        itemconfig.ic_code = form['ic_code']
        itemconfig.tipic_id = form['tipic_id']
        itemconfig.ic_nota = form['ic_nota']
        itemconfig.catic_id = form['catic_id']
        itemconfig.ic_usercrea = user_crea
        itemconfig.ic_grabaiva = form['ic_grabaiva']

        self.dbsession.add(itemconfig)
        self.dbsession.flush()
        ic_id = itemconfig.ic_id

        titemconfigmeta = TItemConfigMeta()
        titemconfigmeta.ic_id = ic_id
        titemconfigmeta.sec_id = sec_id
        titemconfigmeta.icm_existencias = form['icm_existencias']
        titemconfigmeta.icm_proveedor = form['icm_proveedor']
        titemconfigmeta.icm_modcontab = form['icm_modcontab']

        self.dbsession.add(titemconfigmeta)

        titemconfigprecios = TItemConfigPrecios()
        titemconfigprecios.ic_id = ic_id
        titemconfigprecios.icpre_preciocompra = form['icpre_preciocompra']
        titemconfigprecios.icpre_precioventa = form['icpre_precioventa']
        titemconfigprecios.sec_id = sec_id

        self.dbsession.add(titemconfigprecios)