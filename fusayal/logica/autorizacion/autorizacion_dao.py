# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import copy
import logging

from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.logica.autorizacion.autorizacion_model import TAutorizacion
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.utils import checkcambioutil, enums
from fusayal.utils import cadenas, fechas
from pip._vendor.chardet import enums

log = logging.getLogger(__name__)


class TAutorizacionDao(BaseDao):

    def get_form(self, cnt_id):
        form = {
            'aut_id': 0,
            'aut_numero': '',
            'aut_fechaautorizacion': '',
            'aut_fechacaducidad': '',
            # 'aut_tipodoc': 1,
            'aut_estab': '',
            # 'aut_ptoemi': '',
            # 'aut_serie': '',
            # 'aut_secuencia_ini': '',
            # 'aut_secuencia_fin': '',
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
                    '' as td_nombre,
				    tau.aut_estab||'-'||tau.aut_ptoemi aut_serie 
                from tautorizacion tau
                    join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id                    
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
                      'aut_serie')

        return self.all(sql, tupla_desc)

    def find_bycod(self, aut_id):
        sql = """
                select  tau.aut_id,
                        tau.aut_numero,
                        tau.aut_fechaautorizacion,
                        tau.aut_fechacaducidad,                                  
                        tau.cnt_id,
                        cnt.cnt_ruc,
                        cnt.cnt_razonsocial,                                    
                        tau.aut_estab 
                    from tautorizacion tau
                        join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id                                   
                    where tau.aut_id = {0}
                     order by  aut_numero
            """.format(aut_id)

        tupla_desc = ('aut_id',
                      'aut_numero',
                      'aut_fechaautorizacion',
                      'aut_fechacaducidad',
                      'cnt_id',
                      'cnt_ruc',
                      'cnt_razonsocial',
                      'aut_estab')

        return self.first(sql, tupla_desc)

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
                        '' as td_nombre,
                        tau.aut_estab||'-'||tau.aut_ptoemi aut_serie,
                        coalesce(job.job_estado, -1) as job_estado
                    from tautorizacion tau
                        join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id                        
                        left join tjob job on tau.aut_id = job.aut_id
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
                      'aut_serie',
                      'job_estado')

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

    def find_bynum_and_contrib(self, aut_numero, cnt_ruc):

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
                        tau.aut_estab                         
                    from tautorizacion tau
                        join tcontribuyente cnt ON tau.cnt_id = cnt.cnt_id and cnt.cnt_ruc = '{0}'
                    where tau.aut_numero = {1}
            """.format(cnt_ruc, aut_numero)

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
                      'aut_estab')

        return self.first(sql, tupla_desc)

    def editar(self, aut_id, form, user_edit):

        tautorizacion = self.dbsession.query(TAutorizacion).filter(TAutorizacion.aut_id == aut_id).first()
        if tautorizacion is not None:

            tautorizacion_cloned = copy.copy(tautorizacion)

            if not cadenas.es_nonulo_novacio(form['aut_fechaautorizacion']):
                raise ErrorValidacionExc("Ingrese la fecha de autorización")
            if not cadenas.es_nonulo_novacio(form['aut_fechacaducidad']):
                raise ErrorValidacionExc("Ingrese la fecha de caducidad")
            if not cadenas.es_nonulo_novacio(form['aut_estab']):
                raise ErrorValidacionExc("Ingrese el establecimiento")
            """
            if not cadenas.es_nonulo_novacio(form['aut_secuencia_ini']):
                raise ErrorValidacionExc("Ingrese la secuencia inicial")
            if not cadenas.es_nonulo_novacio(form['aut_secuencia_fin']):
                raise ErrorValidacionExc("Ingrese la secuencia final")
            """
            if form.get('cnt_id') is None:
                raise ErrorValidacionExc("Debe especificar el contribuyente")

            fecha_aut_str = form.get('aut_fechaautorizacion')
            fecha_cad_str = form.get('aut_fechacaducidad')

            """
            aut_serie = form['aut_serie']
            form['aut_estab'] = aut_serie[0:3]
            form['aut_ptoemi'] = aut_serie[4:]
            """

            fecha_autorizacion = fechas.parse_cadena(fecha_aut_str)
            fecha_caducidad = fechas.parse_cadena(fecha_cad_str)

            diasvalidos = abs(fecha_caducidad - fecha_autorizacion).days

            if not fechas.es_fecha_a_mayor_fecha_b(fecha_cad_str, fecha_aut_str):
                raise ErrorValidacionExc(u"La fecha de autorización no puede estar despues de la fecha de caducidad")

            if diasvalidos > 366:
                raise ErrorValidacionExc(
                    u"La fecha de caducidad no puede ser mayor a un año a partir de la fecha de autorización")

            """
            secuencia_ini = int(form['aut_secuencia_ini'])
            secuencia_fin = int(form['aut_secuencia_fin'])

            if secuencia_fin <= secuencia_ini:
                raise ErrorValidacionExc(u"Valor para secuencia final incorrecto, favor verifique")
            """

            tautorizacion.aut_numero = form.get('aut_numero')
            tautorizacion.aut_fechaautorizacion = fecha_autorizacion
            tautorizacion.aut_fechacaducidad = fecha_caducidad
            #tautorizacion.aut_tipodoc = form.get('aut_tipodoc')
            #tautorizacion.aut_tipodoc = 0
            tautorizacion.aut_estab = form.get('aut_estab')
            # tautorizacion.aut_ptoemi = form.get('aut_ptoemi')
            tautorizacion.aut_ptoemi = ''
            # tautorizacion.aut_secuencia_ini = form.get('aut_secuencia_ini')
            # tautorizacion.aut_secuencia_fin = form.get('aut_secuencia_fin')
            tautorizacion.aut_secuencia_ini = 0
            tautorizacion.aut_secuencia_fin = 0

            tauditdao = TAuditDao(self.dbsession)
            list_cambios = checkcambioutil.valor_cambiado(tautorizacion_cloned.__json__(), form)
            if list_cambios is not None and len(list_cambios) > 0:
                for row in list_cambios:
                    col = row['col']
                    valorant = row['valorant']
                    valordesp = row['valordesp']
                    tauditdao.crea_accion_update(enums.TBL_AUTORIZACIONES, col, user_edit, valorant, valordesp,
                                                 tautorizacion.aut_id)

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
        if not cadenas.es_nonulo_novacio(form['aut_estab']):
            raise ErrorValidacionExc("Ingrese el establecimiento")

        # if not cadenas.es_nonulo_novacio(form['aut_secuencia_ini']):
        #     raise ErrorValidacionExc("Ingrese la secuencia inicial")
        # if not cadenas.es_nonulo_novacio(form['aut_secuencia_fin']):
        #     raise ErrorValidacionExc("Ingrese la secuencia final")
        if form.get('cnt_id') is None:
            raise ErrorValidacionExc("Debe especificar el contribuyente")

        fecha_aut_str = form.get('aut_fechaautorizacion')
        fecha_cad_str = form.get('aut_fechacaducidad')

        """
        aut_serie = form['aut_serie']
        form['aut_estab'] = aut_serie[0:3]
        form['aut_ptoemi'] = aut_serie[4:]
        """

        fecha_autorizacion = fechas.parse_cadena(fecha_aut_str)
        fecha_caducidad = fechas.parse_cadena(fecha_cad_str)

        #Validar que una fecha ingresada sea correcta
        if not fechas.isvalid(fecha_autorizacion):
            raise ErrorValidacionExc("La fecha de autorización ingresada es incorrecta verifique que se encuentre en el formato dd/mm/aaaa")

        if not fechas.isvalid(fecha_caducidad):
            raise ErrorValidacionExc(
                "La fecha de caducidad ingresada es incorrecta verifique que se encuentre en el formato dd/mm/aaaa")


        #Verificacion de numero de autorizacion
        if not aut_numero.isdigit():
            raise ErrorValidacionExc(u"El numero de autorización ingresado es incorrecto")

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

        # secuencia_ini = int(form['aut_secuencia_ini'])
        # secuencia_fin = int(form['aut_secuencia_fin'])

        # if secuencia_fin <= secuencia_ini:
        #     raise ErrorValidacionExc(u"Valor para secuencia final incorrecto, favor verifique")

        tautorizacion.aut_numero = form.get('aut_numero')
        tautorizacion.aut_fechaautorizacion = fecha_autorizacion
        tautorizacion.aut_fechacaducidad = fecha_caducidad
        # tautorizacion.aut_tipodoc = form.get('aut_tipodoc')
        tautorizacion.aut_tipodoc = 0
        tautorizacion.aut_estab = form.get('aut_estab')
        # tautorizacion.aut_ptoemi = form.get('aut_ptoemi')
        tautorizacion.aut_ptoemi = ''
        # tautorizacion.aut_secuencia_ini = form.get('aut_secuencia_ini')
        # tautorizacion.aut_secuencia_fin = form.get('aut_secuencia_fin')

        tautorizacion.aut_secuencia_ini = 0
        tautorizacion.aut_secuencia_fin = 0

        tautorizacion.cnt_id = cnt_id

        self.dbsession.add(tautorizacion)
        self.dbsession.flush()

        tautditdao = TAuditDao(self.dbsession)
        tautditdao.crea_accion_insert(enums.TBL_AUTORIZACIONES, user_crea, tautorizacion.aut_id)

        return tautorizacion.aut_id
