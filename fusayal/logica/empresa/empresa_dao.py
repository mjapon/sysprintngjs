# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import copy
import logging

from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.logica.contribuyente.contribuyente_dao import TContribuyenteDao
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.empresa.empresa_model import TEmpresa
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.utils import enums, checkcambioutil
from fusayal.utils import fechas, cadenas

log = logging.getLogger(__name__)


class TEmpresaDao(BaseDao):

    def get(self):
        sql = """select emp_id, emp_ruc, emp_razonsocial, emp_nombrecomercial, 
        emp_nroautorizacion, emp_fechaautorizacion from tempresa"""

        return self.first(sql=sql, tupla_desc=('emp_id', 'emp_ruc',
                                               'emp_razonsocial', 'emp_nombrecomercial',
                                               'emp_nroautorizacion', 'emp_fechaautorizacion'))

    def update(self, emp_codigo, form, user_edit):
        tempresa = self.dbsession.query(TEmpresa).filter(TEmpresa.emp_id == emp_codigo).first()

        if not cadenas.es_nonulo_novacio(form['emp_ruc']):
            raise ErrorValidacionExc(u"Debe ingresar el ruc")

        resvalid = TContribuyenteDao.verificar(form['emp_ruc'])
        if not resvalid:
            raise ErrorValidacionExc(u"El número de ruc ingresado es incorrecto")

        if not cadenas.es_nonulo_novacio(form['emp_razonsocial']):
            raise ErrorValidacionExc(u"Debe ingresar la razon social")

        # if not cadenas.es_nonulo_novacio(form['emp_nroautorizacion']):
        #     raise ErrorValidacionExc(u"Debe ingresar el número de autorización")

        if not cadenas.es_nonulo_novacio(form['emp_fechaautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar la fecha de autorización")

        tempresa_cloned = copy.copy(tempresa)

        if tempresa is not None:
            tempresa.emp_ruc = form.get("emp_ruc")
            tempresa.emp_razonsocial = form.get("emp_razonsocial")
            tempresa.emp_nombrecomercial = form.get("emp_nombrecomercial")
            tempresa.emp_fechaautorizacion = fechas.parse_cadena(form.get("emp_fechaautorizacion"))
            # tempresa.emp_nroautorizacion = form.get("emp_nroautorizacion")

            tauditdao = TAuditDao(self.dbsession)
            list_cambios = checkcambioutil.valor_cambiado(tempresa_cloned.__json__(), form)
            if list_cambios is not None and len(list_cambios) > 0:
                for row in list_cambios:
                    col = row['col']
                    valorant = row['valorant']
                    valordesp = row['valordesp']
                    tauditdao.crea_accion_update(enums.TBL_EMPRESA, col, user_edit, valorant, valordesp,
                                                 tempresa.emp_id)

    def crear(self, form, user_crea):

        if not cadenas.es_nonulo_novacio(form['emp_ruc']):
            raise ErrorValidacionExc(u"Debe ingresar el ruc")

        #Validar que el ruc ingresado este correcto
        resvalid = TContribuyenteDao.verificar(form['emp_ruc'])
        if not resvalid:
            raise ErrorValidacionExc(u"El número de ruc ingresado es incorrecto")

        if not cadenas.es_nonulo_novacio(form['emp_razonsocial']):
            raise ErrorValidacionExc(u"Debe ingresar la razon social")

        if not cadenas.es_nonulo_novacio(form['emp_nroautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar el número de autorización")

        #Validar que el numero de autorizacion sea distinto de cero
        emp_nroautorizacion = form['emp_nroautorizacion']
        if not emp_nroautorizacion.isdigit():
            raise ErrorValidacionExc(u"El número de autorización es incorrecto debe ser solo números")
        elif int(emp_nroautorizacion) == 0:
            raise ErrorValidacionExc(u"El número de autorización debe ser distinto de cero")

        if not cadenas.es_nonulo_novacio(form['emp_fechaautorizacion']):
            raise ErrorValidacionExc(u"Debe ingresar la fecha de autorización")
        else:
            #Validar que no sean fechas posteriores a la fecha actual
            if not fechas.isvalid(form['emp_fechaautorizacion']):
                raise ErrorValidacionExc(
                    "La fecha de autorización ingresada es incorrecta verifique que se encuentre en el formato dd/mm/aaaa")

            fecha_actual = fechas.get_str_fecha_actual()

            if not fechas.es_fecha_a_mayor_fecha_b(form['emp_fechaautorizacion'], fecha_actual):
                raise ErrorValidacionExc(u"La fecha de autorización no puede estar despues de la fecha de actual")


        tempresa = TEmpresa()
        tempresa.emp_ruc = form.get("emp_ruc")
        tempresa.emp_razonsocial = form.get("emp_razonsocial")
        tempresa.emp_nombrecomercial = form.get("emp_nombrecomercial")
        tempresa.emp_fechaautorizacion = fechas.parse_cadena(form.get("emp_fechaautorizacion"))
        tempresa.emp_nroautorizacion = form.get("emp_nroautorizacion")
        self.dbsession.add(tempresa)
        self.dbsession.flush()

        tautditdao = TAuditDao(self.dbsession)
        tautditdao.crea_accion_insert(enums.TBL_EMPRESA, user_crea, tempresa.emp_id)
