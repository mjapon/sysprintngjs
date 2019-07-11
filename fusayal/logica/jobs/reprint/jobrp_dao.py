# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""
import datetime
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.jobs.reprint.jobrp_model import TJobReprint

log = logging.getLogger(__name__)


class TJobReprintDao(BaseDao):

    def get_form(self):
        return {
            'jobrp_id': 0,
            'job_id': 0,
            'jobrp_secini': 0,
            'jobrp_secfin': 0,
            'jobrp_obs': ''
        }

    def crear(self, form, user_crea):

        # Validaciones
        job_id = form['job_id']
        jobrp_secini = form['jobrp_secini']
        jobrp_secfin = form['jobrp_secfin']
        jobrp_obs = form['jobrp_obs']

        if job_id is None or job_id == 0:
            raise ErrorValidacionExc('Debe especificar el trabajo de impresion que desea reimprimir')

        if jobrp_secini is None or jobrp_secini == 0:
            raise ErrorValidacionExc('Favor especifique el secuencial inicial que desea reimprimir')

        if jobrp_secfin is None or jobrp_secfin == 0:
            raise ErrorValidacionExc('Favor especifique el secuencial final que desea reimprimir')

        tJobReprint = TJobReprint()
        tJobReprint.job_id = job_id
        tJobReprint.jobrp_secini = jobrp_secini
        tJobReprint.jobrp_secfin = jobrp_secfin
        tJobReprint.jobrp_obs = jobrp_obs
        tJobReprint.user_crea = user_crea
        tJobReprint.jobrp_fechacrea = datetime.datetime.now()

        self.dbsession.add(tJobReprint)
