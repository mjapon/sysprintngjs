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
from fusayal.utils import cadenas

log = logging.getLogger(__name__)


class TJobDao(BaseDao):

    def get_form(self):
        form = {
            'job_id': 0,
            'aut_id': 0,
            'job_nrocopias': 1,
            'cnt_id': 0,
            'job_estado': 1,
            'job_tipodoc': 1,
            'job_ptoemi': '',
            'job_secuencia_ini': '',
            'job_secuencia_fin': '',
        }
        return form

    def listar_estadosjob(self):
        sql = """
        select sjb_id, sjb_nombre from tstatusjob order by sjb_id 
        """
        tupladesc = ("sjb_id", "sjb_nombre")
        return  self.all(sql, tupladesc)

    def listar(self):
        sql = """
        select
               tjob.job_id, 
              tau.aut_numero,
              cnt.cnt_ruc,
              cnt.cnt_razonsocial,
              tau.aut_fechaautorizacion,
              tau.aut_estab||'-'||tjob.job_ptoemi serie,
              td.td_nombre,
              tjob.job_secuencia_ini,
              tjob.job_secuencia_fin,
              tjob.job_nrocopias,
              sjob.sjb_nombre,
              sjob.sjb_id
              from tjob tjob
            join tautorizacion tau ON tau.aut_id = tjob.aut_id
            join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id
            join ttiposdoc td on tjob.job_tipodoc = td.td_id
            join tstatusjob sjob on tjob.job_estado = sjob.sjb_id
            order by job_id        
        """

        tupla_desc = (
            'job_id',
            'aut_numero',
            'cnt_ruc',
            'cnt_razonsocial',
            'aut_fechaautorizacion',
            'serie',
            'td_nombre',
            'job_secuencia_ini',
            'job_secuencia_fin',
            'job_nrocopias',
            'sjb_nombre',
            'sjb_id')

        return self.all(sql, tupla_desc)

    def crear(self, form, user_crea):
        tjob = TJob()

        if form['cnt_id'] == 0:
            raise ErrorValidacionExc(u'Debe especificar el contribuyente')
        if form['aut_id'] == 0:
            raise ErrorValidacionExc(u'Debe seleccionar  la autorización')

        if not cadenas.es_nonulo_novacio(form['job_ptoemi']):
            raise ErrorValidacionExc(u"Ingrese el punto de emisión")
        if not cadenas.es_nonulo_novacio(form['job_secuencia_ini']):
            raise ErrorValidacionExc(u"Ingrese la secuencia inicial")
        if not cadenas.es_nonulo_novacio(form['job_secuencia_fin']):
            raise ErrorValidacionExc(u"Ingrese la secuencia final")

        secuencia_ini = int(form['job_secuencia_ini'])
        secuencia_fin = int(form['job_secuencia_fin'])

        if secuencia_fin <= secuencia_ini:
            raise ErrorValidacionExc(u"Valor para secuencia final incorrecto, favor verifique")

        tjob.cnt_id = form['cnt_id']
        tjob.aut_id = form['aut_id']
        tjob.job_nrocopias = form['job_nrocopias']
        tjob.job_fechacreacion = datetime.now()
        tjob.user_crea = user_crea
        tjob.job_estado = 1  # Estado Nuevo
        tjob.job_ptoemi = form['job_ptoemi']
        tjob.job_tipodoc = form['job_tipodoc']
        tjob.job_secuencia_ini = secuencia_ini
        tjob.job_secuencia_fin = secuencia_fin

        self.dbsession.add(tjob)

        self.dbsession.flush()

        return tjob.job_id

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

    def find_bydcod(self, job_id):

        sql = """
                select
                       tjob.job_id,
                        tau.aut_id,
                        cnt.cnt_id,
                      tau.aut_numero,
                      cnt.cnt_ruc,
                      cnt.cnt_razonsocial,
                      tau.aut_fechaautorizacion,
                      tau.aut_estab||'-'||tjob.job_ptoemi serie,
                      tjob.job_ptoemi,
                      td.td_nombre,
                      tjob.job_secuencia_ini,
                      tjob.job_secuencia_fin,
                      tjob.job_nrocopias,
                      tjob.job_fechacreacion,
                      tjob.job_estado,
                      sjob.sjb_nombre,
                      sjob.sjb_id,
                      tjob.temp_id
                      from tjob tjob
                    join tautorizacion tau ON tau.aut_id = tjob.aut_id
                    join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id
                    join ttiposdoc td on tjob.job_tipodoc = td.td_id
                    join tstatusjob sjob on tjob.job_estado = sjob.sjb_id
                    where tjob.job_id = {0}
                    order by cnt.cnt_razonsocial        
                """.format(job_id)

        tupla_desc = (
            'job_id',
            'aut_id',
            'cnt_id',
            'aut_numero',
            'cnt_ruc',
            'cnt_razonsocial',
            'aut_fechaautorizacion',
            'serie',
            'job_ptoemi',
            'td_nombre',
            'job_secuencia_ini',
            'job_secuencia_fin',
            'job_nrocopias',
            'job_fechacreacion',
            'job_estado',
            'sjb_nombre',
            'sjb_id',
            'temp_id')

        return self.first(sql, tupla_desc)
