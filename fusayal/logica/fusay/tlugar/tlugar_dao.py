# coding: utf-8
"""
Fecha de creacion 
@autor: 
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tlugar.tlugar_model import TLugar
from fusayal.utils import cadenas

log = logging.getLogger(__name__)


class TLugarDao(BaseDao):

    def listar(self):
        sql = """
        select lug_id, lug_nombre, lug_parent from tlugar order by lug_nombre asc
        """

        tupla_desc = ('lug_id', 'lug_nombre', 'lug_parent')
        return self.all(sql, tupla_desc)

    def existe(self, lug_nombre):
        sql = "select count(*) as cuenta from tlugar where lug_nombre = '{0}'".format(cadenas.strip_upper(lug_nombre))
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def crear(self, lug_nombre, lug_parent=None):
        if not cadenas.es_nonulo_novacio(lug_nombre):
            raise ErrorValidacionExc('Debe ingresar el nombre de la ubicación')
        if self.existe(lug_nombre):
            raise ErrorValidacionExc('La ubicación {0} ya esta registrado'.format(lug_nombre))

        tlugar = TLugar()
        tlugar.lug_nombre = cadenas.strip_upper(lug_nombre)
        tlugar.lug_parent = lug_parent

        self.dbsession.add(tlugar)

    def editar(self, lug_id, nlug_nombre):

        self.dbsession.find()
