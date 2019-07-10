# coding: utf-8
"""
Fecha de creacion 28/7/18
@autor: mjapon
"""
from fusayal.logica.dao.base import BaseDao


class TSociosDao(BaseDao):

    def listar(self):

        sql = """select socio_id,
            socio_nui,
            socio_nombre,
            socio_fechareg,
            socio_foto from socios order by socio_id
        """

        tupla_desc = ("socio_id", "socio_nui",  "socio_nombre", "socio_fechareg","socio_foto")

        return self.all(sql, tupla_desc)