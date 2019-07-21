# coding: utf-8
"""
Fecha de creacion 2019-06-07
@autor: mjapon
"""
import logging

from fusayal.logica.empresa.empresa_dao import TEmpresaDao
from fusayal.logica.jobs.job_dao import TJobDao
from fusayal.logica.plantillas.plantilla_dao import TPlantillasDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(path="/rest/plantillas/{tempid}", collection_path="/rest/plantillas")
class PlantillasRest(DbComunView):

    def collection_get(self):
        plantillas_dao = TPlantillasDao(self.dbsession)

        tipo = 1
        if 'tipo' in self.request.params:
            tipo = self.request.params['tipo']

        items = plantillas_dao.listar(tipo)
        cols = [
            {'name': 'temp_id', 'displayName': 'Codigo'},
            {'name': 'temp_name', 'displayName': 'Nombre'}
        ]

        tempresadao = TEmpresaDao(self.dbsession)
        empresa_json = tempresadao.get()
        contribuyente = ''
        if empresa_json is not None:
            contribuyente = empresa_json['emp_razonsocial']

        formexport = {
            'pGeneradoPor': self.gsession('us_nomapel'),
            'pContribuyente': contribuyente
        }

        tjobdao =  TJobDao(self.dbsession)
        estadosjob =  tjobdao.listar_estadosjob()

        return {'status': 200, 'items': items, 'cols': cols, 'formexport': formexport, 'estadojob':estadosjob}

    def get(self):
        temp_id = self.request.matchdict['tempid']
        plantillas_dao = TPlantillasDao(self.dbsession)

        tplantilla = plantillas_dao.find_bycod(temp_id)
        if tplantilla is not None:
            return {'status': 200, 'form': tplantilla.__json__()}
        else:
            return {'status': 400}

    def post(self):
        return {'status': 200, 'res': 'Implementado'}
