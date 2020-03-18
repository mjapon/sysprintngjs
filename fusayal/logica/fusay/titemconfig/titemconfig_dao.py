# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tgrid.tgrid_dao import TGridDao
from fusayal.logica.fusay.titemconfig.titemconfig_model import TItemConfig
from fusayal.logica.fusay.titemconfig_datosprod.titemconfigdatosprod_model import TItemConfigDatosProd
from fusayal.logica.params.param_dao import ParamsDao
from fusayal.utils import fechas, cadenas

log = logging.getLogger(__name__)


class TItemConfigDao(BaseDao):

    def listar(self, filtro):
        tgrid_dao = TGridDao(self.dbsession)
        swhere = u"ic.ic_code like '{0}%' or ic.ic_nombre like '{0}%'".format(
            cadenas.strip_upper(filtro)
        )
        data = tgrid_dao.run_grid(grid_nombre='productos', where=swhere, order='ic_nombre')
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
            'icdp_grabaiva': True,
            'icdp_preciocompra': 0.0,
            'icdp_precioventa': 0.0,
            'icdp_precioventamin': 0.0,
            'icdp_proveedor': -2,
            'icdp_modcontab': 0,
            'icdp_fechacaducidad': ''
        }

        return formic

    def crear(self, form, user_crea):
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
        itemconfig.ic_fechacrea = datetime.now()

        self.dbsession.add(itemconfig)
        self.dbsession.flush()

        ic_id = itemconfig.ic_id

        titemconfigdp = TItemConfigDatosProd()
        titemconfigdp.ic_id = ic_id
        titemconfigdp.icdp_grabaiva = form['icdp_grabaiva']

        icdp_fechacaducidad = form['icdp_fechacaducidad']
        if cadenas.es_nonulo_novacio(icdp_fechacaducidad):
            titemconfigdp.icdp_fechacaducidad = fechas.parse_cadena(icdp_fechacaducidad)
        else:
            titemconfigdp.icdp_fechacaducidad = None

        titemconfigdp.icm_proveedor = form['icm_proveedor']
        titemconfigdp.icm_modcontab = form['icm_modcontab']

        titemconfigdp.icdp_preciocompra = form['icdp_preciocompra']
        titemconfigdp.icdp_precioventa = form['icdp_precioventa']
        titemconfigdp.icdp_precioventamin = form['icdp_precioventamin']

        self.dbsession.add(titemconfigdp)
        return ic_id
