# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""

import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.params.param_model import TParams
from fusayal.utils import cadenas

log = logging.getLogger(__name__)


class TParamsDao(BaseDao):

    def get_param_value(self, abreviacion):
        sql = "select tprm_val as val from tparams where tprm_abrev = '{0}'".format(abreviacion)
        val = self.first_col(sql, 'val')
        return val

    def update_param_value(self, abr, newvalue):
        tparam = self.dbsession.query(TParams.tprm_abrev == abr).first()
        if tparam is not None:
            tparam.tprm_val = cadenas.strip(newvalue)

    def update_sequence_codbar(self):
        abr_sequence = 'artsSeqCodBar'
        tparam = self.dbsession.query(TParams).filter(TParams.tprm_abrev == abr_sequence).first()
        if tparam is not None:
            current_val = int(tparam.tprm_val)
            newvalue = current_val + 1
            tparam.tprm_val = str(newvalue)

    def get_next_sequence_codbar(self):
        next_sequence = self.get_param_value('artsSeqCodBar')
        return int(next_sequence)

    def get_ruta_savejobs(self):
        val = self.get_param_value('pathSaveJobs')
        if val is None:
            raise ErrorValidacionExc(
                u'El parametro pathSaveJobs no está registrado en la base de datos, favor verificar')
        return val
