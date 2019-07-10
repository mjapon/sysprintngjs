# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.jobs.job_model import TJob

log = logging.getLogger(__name__)


class TJobDao(BaseDao):

    def get_form(self):
        form = {
            'job_id': 0,
            'aut_id': 0,
            'job_nrocopias': 1,
            'cnt_id': 0,
            'job_estado': 1
        }
        return form

    def listar(self):
        sql = """
        select
               tjob.job_id, 
              tau.aut_numero,
              cnt.cnt_ruc,
              cnt.cnt_razonsocial,
              tau.aut_fechaautorizacion,
              tau.aut_estab||'-'||tau.aut_ptoemi serie,
              td.td_nombre,
              tau.aut_secuencia_ini,
              tau.aut_secuencia_fin,
              tjob.job_nrocopias,
              sjob.sjb_nombre,
              sjob.sjb_id
              from tjob tjob
            join tautorizacion tau ON tau.aut_id = tjob.aut_id
            join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id
            join ttiposdoc td on tau.aut_tipodoc = td.td_id
            join tstatusjob sjob on tjob.job_estado = sjob.sjb_id
            order by cnt.cnt_razonsocial        
        """

        tupla_desc = (
            'job_id',
            'aut_numero',
            'cnt_ruc',
            'cnt_razonsocial',
            'aut_fechaautorizacion',
            'serie',
            'td_nombre',
            'aut_secuencia_ini',
            'aut_secuencia_fin',
            'job_nrocopias',
            'sjb_nombre',
            'sjb_id')

        return self.all(sql, tupla_desc)

    def crear(self, form, user_crea):
        tjob = TJob()

        if (form['cnt_id'] == 0):
            raise ErrorValidacionExc('Debe especificar el contribuyente')

        if (form['aut_id'] == 0):
            raise ErrorValidacionExc('Debe seleccionar  la autorización')

        tjob.cnt_id = form['cnt_id']
        tjob.aut_id = form['aut_id']
        tjob.job_nrocopias = form['job_nrocopias']
        tjob.job_fechacreacion = datetime.now()
        tjob.user_crea = user_crea
        tjob.job_estado = 1  # Estado Nuevo

        self.dbsession.add(tjob)

    def actualizar_estado(self, job_id, estado, user_actualiza):
        tjob = self.dbsession.query(TJob).filter(TJob.job_id == job_id).first()
        if tjob is not None:
            tjob.job_estado = estado
            tjob.job_fechaactualizacion = datetime.now()
            tjob.user_actualiza = user_actualiza

    def actualizar_plantilla(self, job_id, temp_id):
        tjob = self.dbsession.query(TJob).filter(TJob.job_id == job_id).first()
        if tjob is not None:
            tjob.temp_id = temp_id
