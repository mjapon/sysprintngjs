# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import copy
import logging

from pip._vendor.chardet import enums

from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.logica.autorizacion.autorizacion_model import TAutorizacion
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.utils import checkcambioutil, enums
from fusayal.utils import cadenas, fechas

log = logging.getLogger(__name__)


class TAutorizacionDao(BaseDao):

    def get_form(self, cnt_id):
        form = {
            'aut_id': 0,
            'aut_numero': '',
            'aut_fechaautorizacion': '',
            'aut_fechacaducidad': '',
            'aut_tipodoc': 1,
            'aut_estab': '',
            'aut_ptoemi': '',
            'aut_serie': '',
            'aut_secuencia_ini': '',
            'aut_secuencia_fin': '',
            'cnt_id': cnt_id
        }
        return form

    def listar_tiposdoc(self):
        """

        :return:
        """
        sql = "select td_id, td_nombre from ttiposdoc ORDER BY  td_id"
        tupla_desc = ('td_id', 'td_nombre')
        return self.all(sql, tupla_desc)

    def listar_all(self):

        sql = """
            select  tau.aut_id,
                    tau.aut_numero,
                    tau.aut_fechaautorizacion,
                    tau.aut_fechacaducidad,
                    tau.aut_tipodoc,
                    tau.aut_ptoemi,
                    tau.aut_secuencia_ini,
                    tau.aut_secuencia_fin,
                    tau.cnt_id,
                    cnt.cnt_ruc,
                    cnt.cnt_razonsocial,
                    td.td_nombre,
				    tau.aut_estab||'-'||tau.aut_ptoemi serie 
                from tautorizacion tau
                    join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id
                    join ttiposdoc td on tau.aut_tipodoc = td.td_id
                 order by  aut_tipodoc, aut_numero
        """
        tupla_desc = ('aut_id',
                      'aut_numero',
                      'aut_fechaautorizacion',
                      'aut_fechacaducidad',
                      'aut_tipodoc',
                      'aut_ptoemi',
                      'aut_secuencia_ini',
                      'aut_secuencia_fin',
                      'cnt_id',
                      'cnt_ruc',
                      'cnt_razonsocial',
                      'td_nombre',
                      'serie')

        return self.all(sql, tupla_desc)

    def listar(self, cnt_id):

        sql = """
                    select  tau.aut_id,
                            tau.aut_numero,
                            tau.aut_fechaautorizacion,
                            tau.aut_fechacaducidad,
                            tau.aut_tipodoc,
                            tau.aut_ptoemi,
                            tau.aut_secuencia_ini,
                            tau.aut_secuencia_fin,
                            tau.cnt_id,
                            cnt.cnt_ruc,
                            cnt.cnt_razonsocial,
                            td.td_nombre,
        				    tau.aut_estab||'-'||tau.aut_ptoemi serie 
                        from tautorizacion tau
                            join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id
                            join ttiposdoc td on tau.aut_tipodoc = td.td_id
                        where tau.cnt_id = {0}
                         order by  aut_tipodoc, aut_numero
                """.format(cnt_id)

        tupla_desc = ('aut_id',
                      'aut_numero',
                      'aut_fechaautorizacion',
                      'aut_fechacaducidad',
                      'aut_tipodoc',
                      'aut_ptoemi',
                      'aut_secuencia_ini',
                      'aut_secuencia_fin',
                      'cnt_id',
                      'cnt_ruc',
                      'cnt_razonsocial',
                      'td_nombre',
                      'serie')

        return self.all(sql, tupla_desc)

    def ya_exite(self, cnt_id, aut_numero):
        """
        Verifica si un numero de autorizacion ya ha sido registrado para el contribuyente especificado
        :param cnt_id:
        :param aut_numero:
        :return:
        """
        sql = "select count(*) as cuenta from tautorizacion where cnt_id = {0} and aut_numero={1}".format(
            cnt_id,
            aut_numero
        )
        cuenta = self.first_col(sql, col="cuenta")
        return cuenta > 0

    def crear(self, form, user_crea):

        tautorizacion = TAutorizacion()

        aut_numero = form['aut_numero']
        if aut_numero is None or len(str(aut_numero).strip()) == 0:
            raise ErrorValidacionExc("Ingrese el número de autorización")
        if not cadenas.es_nonulo_novacio(form['aut_fechaautorizacion']):
            raise ErrorValidacionExc("Ingrese la fecha de autorización")
        if not cadenas.es_nonulo_novacio(form['aut_fechacaducidad']):
            raise ErrorValidacionExc("Ingrese la fecha de caducidad")
        """
        if not cadenas.es_nonulo_novacio(form['aut_estab']):
            raise ErrorValidacionExc("Ingrese el establecimiento")
        if not cadenas.es_nonulo_novacio(form['aut_ptoemi']):
            raise ErrorValidacionExc("Ingrese el punto de emisión")
        """
        if not cadenas.es_nonulo_novacio(form['aut_serie']):
            raise ErrorValidacionExc("Ingrese la serie")

        if not cadenas.es_nonulo_novacio(form['aut_secuencia_ini']):
            raise ErrorValidacionExc("Ingrese la secuencia inicial")
        if not cadenas.es_nonulo_novacio(form['aut_secuencia_fin']):
            raise ErrorValidacionExc("Ingrese la secuencia final")
        if form.get('cnt_id') is None:
            raise ErrorValidacionExc("Debe especificar el contribuyente")

        fecha_aut_str = form.get('aut_fechaautorizacion')
        fecha_cad_str = form.get('aut_fechacaducidad')

        aut_serie = form['aut_serie']
        form['aut_estab'] = aut_serie[0:3]
        form['aut_ptoemi'] = aut_serie[4:]

        fecha_autorizacion = fechas.parse_cadena(fecha_aut_str)
        fecha_caducidad = fechas.parse_cadena(fecha_cad_str)

        diasvalidos = abs(fecha_caducidad - fecha_autorizacion).days

        if not fechas.es_fecha_a_mayor_fecha_b(fecha_cad_str, fecha_aut_str):
            raise ErrorValidacionExc(u"La fecha de autorización no puede estar despues de la fecha de caducidad")

        if diasvalidos > 366:
            raise ErrorValidacionExc(
                u"La fecha de caducidad no puede ser mayor a un año a partir de la fecha de autorización")

        cnt_id = int(form.get('cnt_id'))
        if self.ya_exite(cnt_id=cnt_id, aut_numero=form.get('aut_numero')):
            raise ErrorValidacionExc(
                u"La autorización nro:{0} ya ha sido registrada, ingrese otra".format(form.get('aut_numero')))

        secuencia_ini = int(form['aut_secuencia_ini'])
        secuencia_fin = int(form['aut_secuencia_fin'])

        if secuencia_fin <= secuencia_ini:
            raise ErrorValidacionExc(u"Valor para secuencia final incorrecto, favor verifique")

        tautorizacion.aut_numero = form.get('aut_numero')
        tautorizacion.aut_fechaautorizacion = fecha_autorizacion
        tautorizacion.aut_fechacaducidad = fecha_caducidad
        tautorizacion.aut_tipodoc = form.get('aut_tipodoc')
        tautorizacion.aut_estab = form.get('aut_estab')
        tautorizacion.aut_ptoemi = form.get('aut_ptoemi')
        tautorizacion.aut_secuencia_ini = form.get('aut_secuencia_ini')
        tautorizacion.aut_secuencia_fin = form.get('aut_secuencia_fin')
        tautorizacion.cnt_id = cnt_id

        self.dbsession.add(tautorizacion)
        self.dbsession.flush()

        tautditdao = TAuditDao(self.dbsession)
        tautditdao.crea_accion_insert(enums.TBL_AUTORIZACIONES, user_crea, tautorizacion.aut_id)