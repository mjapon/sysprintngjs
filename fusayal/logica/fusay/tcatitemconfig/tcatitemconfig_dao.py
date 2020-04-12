# coding: utf-8
"""
Fecha de creacion 2/17/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tcatitemconfig.tcatitemconfig_model import TCatItemConfig
from fusayal.utils import cadenas

log = logging.getLogger(__name__)


class TCatItemConfigDao(BaseDao):

    def listar(self):
        sql = "select catic_id, catic_nombre from tcatitemconfig where catic_estado = 1 order by catic_id"
        tupla = ('catic_id', 'catic_nombre')
        return self.all(sql, tupla)

    def existe(self, nombre_cat):
        sql = u"select count(*) as cuenta from tcatitemconfig where catic_nombre = '{0}' and catic_estado = 1 ".format(
            cadenas.strip_upper(nombre_cat))
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def crear(self, nombre):
        if not cadenas.es_nonulo_novacio(nombre):
            raise ErrorValidacionExc(u'Debe ingresar el nombre de la categoría')

        if self.existe(nombre):
            raise ErrorValidacionExc(u'Ya existe una categoría con el nombre {0}, ingrese otra'.format(nombre))

        tcategoria = TCatItemConfig()
        tcategoria.catic_nombre = cadenas.strip_upper(nombre)
        tcategoria.catic_estado = 1

        self.dbsession.add(tcategoria)

    def actualizar(self, catic_id, nombre):
        tcatitem = self.dbsession.find(TCatItemConfig).filter(TCatItemConfig.catic_id == catic_id).first()
        if tcatitem is not None:
            catic_nombre = cadenas.strip_upper(tcatitem.catic_nombre)
            nombre_upper = cadenas.strip_upper(nombre)
            if catic_nombre != nombre_upper:
                if self.existe(nombre):
                    raise ErrorValidacionExc(u'Ya existe una categoría con el nombre {0}, ingrese otra'.format(nombre))
                else:
                    tcatitem.catic_nombre = nombre_upper
                    self.dbsession.add(tcatitem)

    def anular(self, catic_id):
        tcatitem = self.dbsession.find(TCatItemConfig).filter(TCatItemConfig.catic_id == catic_id).first()
        if tcatitem is not None:
            tcatitem.catic_estado = 2
            self.dbsession.add(tcatitem)