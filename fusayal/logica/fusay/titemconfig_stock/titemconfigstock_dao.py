# coding: utf-8
"""
Fecha de creacion 4/4/20
@autor: mjapon
"""
import logging
from datetime import datetime
from decimal import Decimal

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.titemconfig_stock.titemconfigstock_model import TItemConfigStock
from fusayal.logica.tseccion.tseccion_dao import TSeccionDao

log = logging.getLogger(__name__)


class TItemConfigStockDao(BaseDao):

    def get_form(self, ic_id, sec_id):
        form = {'ic_id': ic_id,
                'sec_id': sec_id,
                'ice_stock': 0}
        return form

    def get_form_secciones(self, ic_id):
        """
        Retornar un arreglo para registrar el stock por seciones
        :param ic_id:
        :return:
        """

        tseccion_dao = TSeccionDao(self.dbsession)
        secciones = tseccion_dao.listar()

        stock_secciones = []
        for seccion in secciones:
            form = self.get_form(ic_id, seccion['sec_id'])
            form['sec_nombre'] = seccion['sec_nombre']
            stock_secciones.append(form)

        return stock_secciones

    def get_stock(self, ic_id):
        """
        Retorna un array con los datos de stock del articulo {ic_id, sec_id, sec_nombre, ic_stock}
        :param ic_id:
        :return: Array con los datos de stock del articulo por seccion
        """

        sql = """        
        select
        coalesce(ice.ice_id,0) as ice_id,
        coalesce(ice.ic_id, {0}) as ic_id,
        sec.sec_id,
        sec.sec_nombre,
        coalesce(ice.ice_stock, 0) as ice_stock from tseccion sec
        left join titemconfig_stock ice on ice.sec_id= sec.sec_id and ice.ic_id = {0}
        order by sec.sec_nombre asc;
        """.format(ic_id)

        tupla_desc = ('ice_id', 'ic_id', 'sec_id', 'sec_nombre', 'ice_stock')
        return self.all(sql, tupla_desc)

    def crear_actualizar(self, form_secs, user_do):

        for item in form_secs:
            ice_id = int(item['ice_id'])
            if ice_id == 0:
                itemconfigstock = TItemConfigStock()
                itemconfigstock.ic_id = item['ic_id']
                itemconfigstock.sec_id = item['sec_id']
                itemconfigstock.ice_stock = Decimal(item['ice_stock'])
                itemconfigstock.user_crea = user_do
                itemconfigstock.fecha_crea = datetime.now()
                self.dbsession.add(itemconfigstock)
            else:
                itemconfigstock = self.dbsession.query(TItemConfigStock).filter(
                    TItemConfigStock.ice_id == ice_id).first()
                if itemconfigstock is not None:
                    itemconfigstock.ice_stock = Decimal(item['ice_stock'])
                    itemconfigstock.user_actualiza = user_do
                    itemconfigstock.fecha_actualiza = datetime.now()
                    self.dbsession.add(itemconfigstock)
