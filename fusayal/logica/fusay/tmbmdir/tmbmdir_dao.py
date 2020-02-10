# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)

class TMiembroDirDao(BaseDao):

    def getByTipo(self, tipo):

        sql = """
        select idm, 
        tipo, nombre, 
        img, longdet, 
        shortdet  from tmbmdir where tipo = '{0}'
        """.format(tipo)

        log.info('sql que se envia ejecutar es:')
        log.info(sql)

        tupla_desc = ('idm','tipo', 'nombre', 'img', 'longdet','shortdet')

        return self.first(sql, tupla_desc)