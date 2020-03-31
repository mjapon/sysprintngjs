# coding: utf-8
"""
Fecha de creacion 7/21/19
@autor: mjapon
"""
import logging

from fusayal.logica.jobs.jobdoc.jobdoc_dao import TJobDocDao
from fusayal.logica.params.param_dao import TParamsDao
from fusayal.logica.plantillas.plantilla_dao import TPlantillasDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(path="/rest/jobdoc/{job_id}", collection_path="/rest/jobdoc")
class TJobDocRest(DbComunView):

    def collection_get(self):
        acc = self.request.params['acc']

        if acc == 'template':
            emp_esquema = self.request.params['emp_esquema']
            self.change_dbschema(emp_esquema)
            codrep = self.request.params['codrep']
            plantillasdao = TPlantillasDao(self.dbsession)
            plantilla = plantillasdao.find_bycod(cod=codrep)
            if plantilla is not None:
                return plantilla.temp_jrxml
        elif acc == 'save':
            emp_esquema = self.request.params['emp_esquema']
            self.change_dbschema(emp_esquema)
            jobId= self.request.params['jobId']
            path = self.request.params['path']

            print 'parametros que llegan son'
            print emp_esquema
            print jobId
            print path

            jobdocdao = TJobDocDao(self.dbsession)
            jobdocdao.crear(job_id=jobId,nombre_archivo=path,user_crea=1)
            return 'registrado'
        elif acc == 'pathSaveDoc':
            emp_esquema = self.request.params['emp_esquema']
            self.change_dbschema(emp_esquema)
            tparamdao = TParamsDao(self.dbsession)
            path = tparamdao.get_param_value("pathSaveJobs")
            return path
        elif acc == 'pathDocSaved':
            emp_esquema = self.request.params['emp_esquema']
            jobid = self.request.params['jobid']
            self.change_dbschema(emp_esquema)
            jobdocdao = TJobDocDao(self.dbsession)
            res = jobdocdao.pathsaveddoc(job_id=jobid)
            if res is not None:
                return res
            else:
                return 'None'



        return "Ninguna accion ejecutada"

