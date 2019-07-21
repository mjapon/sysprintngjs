# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import logging

from fusayal.logica.empresa.empresa_dao import TEmpresaDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource

log = logging.getLogger(__name__)

@resource(path="/rest/tempresa/{emp_id}",collection_path="/rest/tempresa")
class TEmpresaRest(DbComunView):

    def get(self):
        tempresadao = TEmpresaDao(self.dbsession)

        tempresa = tempresadao.get()
        if tempresa is not None:
            return {'estado':200, 'tempresa':tempresa}
        else:
            tempresa = {
                'emp_id':0,
                'emp_ruc':'',
                'emp_razonsocial':'',
                'emp_nombrecomercial':'',
                'emp_nroautorizacion':'',
                'emp_fechaautorizacion':''
            }
            return {'estado':404, 'tempresa':tempresa}

    def post(self):
        emp_id = self.request.matchdict['emp_id']
        form = self.get_json_body()
        tempresadao = TEmpresaDao(self.dbsession)
        if int(emp_id) == 0:
            tempresadao.crear(form, user_crea=self.get_userid())
            return {'estado':200, 'msg':'Creación exitosa'}
        else:
            tempresadao.update(emp_codigo=emp_id, form=form, user_edit=self.get_userid())
            return {'estado': 200, 'msg': 'Actualización exitosa'}