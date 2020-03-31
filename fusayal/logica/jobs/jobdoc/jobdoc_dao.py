# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""
import copy
import datetime
import logging
import os

from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.jobs.jobdoc.jobdoc_model import TJobDoc
from fusayal.logica.params.param_dao import TParamsDao
from fusayal.logica.utils import enums

log = logging.getLogger(__name__)


class TJobDocDao(BaseDao):

    def crear(self, job_id, nombre_archivo, user_crea, tipocarga=0):

        paramsdao = TParamsDao(self.dbsession)
        path_save_jobs = paramsdao.get_ruta_savejobs()

        if self.existe(job_id):
            tjobdoc = self.find_by_job(job_id)
            if tjobdoc is not None:
                tjobdoc_cloned = copy.copy(tjobdoc)
                ruta = "{0}{1}{2}".format(path_save_jobs, os.path.sep, nombre_archivo)
                tjobdoc.tjd_ruta = ruta
                tjobdoc.tjd_tipo = tipocarga

                tauditdao = TAuditDao(self.dbsession)
                tauditdao.crea_accion_update(enums.TBL_JOBDOC, 'tjd_ruta', user_crea, tjobdoc_cloned.tjd_ruta,
                                             '{0}_*'.format(ruta),
                                             tjobdoc.tjd_id, aud_obs='Archivo actualizado')

            return {'msg': 'Trabajo de Impresión actualizado correctamente', 'ruta': ruta}
        else:

            ruta = u"{0}{1}{2}".format(path_save_jobs, os.path.sep, nombre_archivo)

            tjobdoc = TJobDoc()
            tjobdoc.tjob_id = job_id
            tjobdoc.tjd_ruta = ruta
            tjobdoc.tjd_fechacrea = datetime.datetime.now()
            tjobdoc.tjd_usercrea = user_crea
            tjobdoc.tjd_tipo = tipocarga

            self.dbsession.add(tjobdoc)
            return {'msg': 'Trabajo de Impresión registrado correctamente', 'ruta': ruta}

    def existe(self, job_id):
        sql = "select count(*) as cuenta from tjobdoc where  tjob_id = {0}".format(job_id)
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def find_by_job(self, job_id):
        tjobdoc = self.dbsession.query(TJobDoc).filter(TJobDoc.tjob_id == job_id).first()
        return tjobdoc

    def pathsaveddoc(self, job_id):
        tjobdoc = self.find_by_job(job_id)
        if tjobdoc is not None:
            return tjobdoc.tjd_ruta
        return None
