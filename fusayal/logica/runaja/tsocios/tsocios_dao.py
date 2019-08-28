# coding: utf-8
"""
Fecha de creacion 8/27/19
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class TSociosDao(BaseDao):

    def autenticar(self, user_id, user_pass):
        sql = "select count(*) as cuenta from tsocios where soc_nui = '{0}' and soc_clave = {1}' ".format(user_id,
                                                                                                          user_pass)
        cuenta = self.first_col(sql, col="cuenta")
        return cuenta > 0

    def listar_pagos(self, socio_id, tipocuota, anio):
        sql = """
        select pag_id, tipc_id, tstp_id, soc_id, socreg_id, pag_gecreg,
        pag_rutacompro, pag_monto, pag_anio, pag_mes, pag_obs from tpago where 
        soc_id = {0} and tipc_id = {1} and pag_anio = {2} order by pag_mes
        """.format(socio_id, tipocuota, anio)

        tupla_desc = ('pag_id', 'tipc_id', 'tstp_id', 'soc_id', 'socreg_id', 'pag_gecreg',
                      'pag_rutacompro', 'pag_monto', 'pag_anio', 'pag_mes', 'pag_obs')

        return self.all(sql, tupla_desc)
