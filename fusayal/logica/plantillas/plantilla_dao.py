# coding: utf-8
"""
Fecha de creacion 2019-06-07
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.plantillas.plantilla_model import TPlantilla

log = logging.getLogger(__name__)


class TPlantillasDao(BaseDao):

    def listar(self, tipo):
        sql = "select temp_id, temp_name, temp_desc from tplantilla where temp_tipo={0} order by temp_id".format(tipo)
        log.info("sql que se ejecuta es:")
        log.info(sql)
        tupla_desc = ('temp_id', 'temp_name', 'temp_desc')

        return self.all(sql, tupla_desc)

    def ya_existe(self, temp_name):
        sql = "select count(*) as cuenta from tplantilla where temp_name = '{0}'".format(temp_name.upper())
        cuenta = self.first_col(sql, col="cuenta")
        return cuenta > 0

    def crear(self, temp_name, temp_jrxml):
        if self.ya_existe(temp_name):
            raise ErrorValidacionExc(
                'La plantilla con el nombre {0} ya ha sido registrada ingrese otro nombre'.format(temp_name.upper()))

        tplantilla = TPlantilla()
        tplantilla.temp_name = temp_name.upper()
        tplantilla.temp_jrxml = temp_jrxml
        tplantilla.temp_tipo = 1
        tplantilla.temp_desc = ''
        self.dbsession.add(tplantilla)

    def actualizar(self, temp_id, new_temp_name, new_temp_jrxml):
        tplantilla = self.dbsession.query(TPlantilla).filter(TPlantilla.temp_id == temp_id).first()
        if tplantilla is not None:
            temp_name = tplantilla.temp_name

            if new_temp_name != temp_name:
                if self.ya_existe(new_temp_name):
                    raise ErrorValidacionExc(
                        'La plantilla con el nombre {0} ya ha sido registrada ingrese otro nombre'.format(
                            temp_name.upper()))

            tplantilla.temp_name = new_temp_name.upper()
            tplantilla.temp_jrxml = new_temp_jrxml

    def find_bycod(self, cod):
        """
        Busca un plantilla por su codigo
        :param cod:
        :return:
        """

        return self.dbsession.query(TPlantilla).filter(TPlantilla.temp_id == cod).first()
