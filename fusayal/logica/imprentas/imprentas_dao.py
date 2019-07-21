# coding: utf-8
"""
Fecha de creacion 7/21/19
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class ImprentasDao(BaseDao):

    def get_datos_empresa(self, imp_codigo):

        sql = "select timp_id,timp_code,timp_esquema,timp_nombrecomercial from public.timprentas where timp_code = '{0}'".format(
            imp_codigo.strip()
        )
        tupla_desc = ("timp_id","timp_code","timp_esquema","timp_nombrecomercial")

        return self.first(sql,tupla_desc)
