# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.empresa.empresa_model import TEmpresa
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.utils import fechas, cadenas

log = logging.getLogger(__name__)


class TEmpresaDao(BaseDao):

    def get(self):
        sql = """select emp_id, emp_ruc, emp_razonsocial, emp_nombrecomercial, 
        emp_nroautorizacion, emp_fechaautorizacion from tempresa"""

        return self.first(sql=sql, tupla_desc=('emp_id', 'emp_ruc',
                                               'emp_razonsocial', 'emp_nombrecomercial',
                                               'emp_nroautorizacion', 'emp_fechaautorizacion'))

    def update(self, emp_codigo, form):
        tempresa = self.dbsession.query(TEmpresa).filter(TEmpresa.emp_id == emp_codigo).first()

        if not cadenas.es_nonulo_novacio(form['emp_ruc']):
            raise ErrorValidacionExc(u"Debe ingresar el ruc")

        if not cadenas.es_nonulo_novacio(form['emp_razonsocial']):
            raise ErrorValidacionExc(u"Debe ingresar la razon social")

        if not cadenas.es_nonulo_novacio(form['emp_nroautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar el número de autorización")

        if not cadenas.es_nonulo_novacio(form['emp_fechaautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar la fecha de autorización")

        if tempresa is not None:
            tempresa.emp_ruc = form.get("emp_ruc")
            tempresa.emp_razonsocial = form.get("emp_razonsocial")
            tempresa.emp_nombrecomercial = form.get("emp_nombrecomercial")
            tempresa.emp_fechaautorizacion = fechas.parse_cadena(form.get("emp_fechaautorizacion"))
            tempresa.emp_nroautorizacion = form.get("emp_nroautorizacion")

    def crear(self, form):

        if not cadenas.es_nonulo_novacio(form['emp_ruc']):
            raise ErrorValidacionExc(u"Debe ingresar el ruc")

        if not cadenas.es_nonulo_novacio(form['emp_razonsocial']):
            raise ErrorValidacionExc(u"Debe ingresar la razon social")

        if not cadenas.es_nonulo_novacio(form['emp_nroautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar el número de autorización")

        if not cadenas.es_nonulo_novacio(form['emp_fechaautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar la fecha de autorización")

        tempresa = TEmpresa()
        tempresa.emp_ruc = form.get("emp_ruc")
        tempresa.emp_razonsocial = form.get("emp_razonsocial")
        tempresa.emp_nombrecomercial = form.get("emp_nombrecomercial")
        tempresa.emp_fechaautorizacion = fechas.parse_cadena(form.get("emp_fechaautorizacion"))
        tempresa.emp_nroautorizacion = form.get("emp_nroautorizacion")
        self.dbsession.add(tempresa)