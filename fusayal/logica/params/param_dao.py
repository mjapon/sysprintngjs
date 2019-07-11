# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""

import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc

log = logging.getLogger(__name__)


class ParamsDao(BaseDao):

    def get_param_value(self, abreviacion):
        sql = "select tprm_val as val from tparams where tprm_abrev = '{0}'".format(abreviacion)
        val = self.first_col(sql, 'val')
        return val

    def get_ruta_savejobs(self):
        val = self.get_param_value('pathSaveJobs')
        if val is None:
            raise ErrorValidacionExc('El parametro pathSaveJobs no está registrado en la base de datos, favor verificar')
        return val
