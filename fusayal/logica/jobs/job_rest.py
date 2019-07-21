# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""
import logging

from cornice.resource import resource

from fusayal.logica.autorizacion.autorizacion_dao import TAutorizacionDao
from fusayal.logica.contribuyente.contribuyente_dao import TContribuyenteDao
from fusayal.logica.jobs.job_dao import TJobDao
from fusayal.utils.pyramidutil import DbComunView

log = logging.getLogger(__name__)


@resource(path="/rest/job/{job_id}", collection_path="/rest/job")
class TJobRest(DbComunView):

    def collection_get(self):
        tjobdao = TJobDao(self.dbsession)

        accion = self.get_request_param('accion')
        if accion is not None:
            return {'estado': 201, 'msg': 'Ninguna accion realizada'}
        else:
            items = tjobdao.listar()
            cols = [
                {'prop': 'job_id', 'label': u'#'},
                {'prop': 'aut_numero', 'label': u'Autorización'},
                    {'prop': 'cnt_ruc', 'label': 'RUC'},
                    {'prop': 'cnt_razonsocial', 'label': u'Razón Social'},
                    {'prop': 'aut_fechaautorizacion', 'label': u'Fecha Autorización'},
                    {'prop': 'serie', 'label': u'Serie'},
                    {'prop': 'td_nombre', 'label': u'Tipo Documento'},
                    {'prop': 'job_secuencia_ini', 'label': u'Desde'},
                    {'prop': 'job_secuencia_fin', 'label': u'Hasta'},
                    {'prop': 'job_nrocopias', 'label': u'Copias'},
                    {'prop': 'sjb_nombre', 'label': u'Estado'}]
            return {'estado': 200, 'items': items, 'cols': cols}

    def post(self):
        job_id = self.get_request_matchdict('job_id')
        accion = self.get_request_param('accion')

        if job_id is not None:
            job_id = int(job_id)

        tjobdao = TJobDao(self.dbsession)
        if job_id == 0:
            job_id = tjobdao.crear(form=self.get_json_body(), user_crea=self.get_userid())
            return {'estado': 200, 'msg': u'Registro exitoso', 'job_id': job_id}

        if accion == 'cambiar_estado':
            form = self.get_json_body()
            tjobdao.actualizar_estado(job_id=job_id, estado=form['newestado'], user_actualiza=self.get_userid())
            return {'estado': 200, 'msg': u'Actualización exitosa'}

        if accion == 'put_reporte':
            form = self.get_json_body()
            tjobdao.actualizar_plantilla(job_id=job_id, temp_id=form['temp_id'])
            return {'estado': 200, 'msg': u'Reporte asignado correctamente'}

        return {'estado': 200, 'msg': 'Ninguna accion realizada'}

    def get(self):
        accion = self.get_request_param('accion')
        tjobdao = TJobDao(self.dbsession)
        if accion == 'form':
            contribdao = TContribuyenteDao(self.dbsession)
            contribuyentes = contribdao.listar()
            return {'estado': 200, 'form': tjobdao.get_form(), 'contribs': contribuyentes}
        elif accion == 'justform':
            return {'estado': 200, 'form': tjobdao.get_form()}
        elif accion == 'getall':
            job_id = self.get_request_matchdict('job_id')
            form_job = tjobdao.find_bydcod(job_id=job_id)

            tautoriza_dao = TAutorizacionDao(self.dbsession)
            form_aut = tautoriza_dao.find_bycod(aut_id=form_job['aut_id'])

            tcontrib_dao = TContribuyenteDao(self.dbsession)
            form_contrib = tcontrib_dao.get_form_edit(cnt_id=form_job['cnt_id'])

            return {'estado': 200, 'form_job': form_job, 'form_aut': form_aut, 'form_contrib': form_contrib}
