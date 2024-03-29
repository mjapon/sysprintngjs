# coding: utf-8
"""
Fecha de creacion 26/12/2019
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tpersona.tpersona_model import TPersona
from fusayal.utils import cadenas, fechas

log = logging.getLogger(__name__)


class TPersonaDao(BaseDao):
    BASE_SQL = u"""
    select per_id,
               per_ciruc,
               per_nombres,
               per_apellidos,
               per_direccion,
               per_telf,
               per_movil,
               per_email,
               per_tipo,
               per_lugnac,
               per_nota,
               per_fechanac,
               per_genero,
               per_estadocivil,
               per_lugresidencia, 
               per_ocupacion from tpersona
    """
    BASE_TUPLA_DESC = ('per_id',
                       'per_ciruc',
                       'per_nombres',
                       'per_apellidos',
                       'per_direccion',
                       'per_telf',
                       'per_movil',
                       'per_email',
                       'per_tipo',
                       'per_lugnac',
                       'per_nota',
                       'per_fechanac',
                       'per_genero',
                       'per_estadocivil',
                       'per_lugresidencia',
                       'per_ocupacion')

    def getform(self):
        return {
            'per_id': 0,
            'per_ciruc': '',
            'per_nombres': '',
            'per_apellidos': '',
            'per_direccion': '',
            'per_telf': '',
            'per_movil': '',
            'per_email': '',
            'per_tipo': 1,
            'per_lugnac': 0,
            'per_nota': ''
        }

    def get_tipos(self):
        tipos = [{
            'value': 1, 'label': 'Empleado'
        }]

        return tipos

    def get_datos_completos(self, per_ciruc):
        """
        Retorna los datos completos de una persona
        :param per_ciruc:
        :return: per_id,
            per_ciruc,
            per_nombres,
            per_apellidos,
            per_direccion,
            per_telf,
            per_movil,
            per_email,
            per_fecreg,
            per_tipo,
            per_lugnac,
            per_nota,
            per_fechanac,
            per_genero,
            per_estadocivil,
            per_lugresidencia
        """
        sql = u"""select
            per_id,
            per_ciruc,
            per_nombres,
            per_apellidos,
            per_direccion,
            per_telf,
            per_movil,
            per_email,
            per_fecreg,
            per_tipo,
            per_lugnac,
            per_nota,
            per_fechanac,
            per_genero,
            per_estadocivil,
            per_lugresidencia from tpersona where per_ciruc = '{0}' 
        """.format(cadenas.strip(per_ciruc))

        tupla_desc = ('per_id',
                      'per_ciruc',
                      'per_nombres',
                      'per_apellidos',
                      'per_direccion',
                      'per_telf',
                      'per_movil',
                      'per_email',
                      'per_fecreg',
                      'per_tipo',
                      'per_lugnac',
                      'per_nota',
                      'per_fechanac',
                      'per_genero',
                      'per_estadocivil',
                      'per_lugresidencia',
                      'per_ocupacion')
        return self.first(sql, tupla_desc)

    def buscar_porciruc(self, per_ciruc):
        sql = "{0} where per_ciruc = '{1}'".format(self.BASE_SQL, cadenas.strip(per_ciruc))
        result = self.first(sql, tupla_desc=self.BASE_TUPLA_DESC)
        try:
            if result is not None and cadenas.es_nonulo_novacio(result['per_fechanac']):
                edad = fechas.get_edad_anios(fechas.parse_cadena(result['per_fechanac']))
                result['per_edad'] = edad
        except:
            pass

        return result

    def get_entity_byid(self, per_id):
        return self.dbsession.query(TPersona).filter(TPersona.per_id == per_id).first()

    def buscar_porcodigo(self, per_id):
        sql = "{0} where per_id = {1}".format(self.BASE_SQL, per_id)
        return self.first(sql, self.BASE_TUPLA_DESC)

    def buscar_poremail(self, per_email):
        sql = "{0} where per_email = '{1}'".format(self.BASE_SQL, cadenas.strip(per_email))
        return self.first(sql, tupla_desc=self.BASE_TUPLA_DESC)

    def buscar_pornomapelci(self, filtro, solo_cedulas=True, limit=30, offsset=0):
        basesql = u"""
        select per_id,
                        per_ciruc,
                        per_genero,
                        per_nombres||' '||coalesce(per_apellidos,'') as nomapel,
                        per_lugresidencia,
                        coalesce(tlugar.lug_nombre,'') as lugresidencia
                        from tpersona
                        left join tlugar on tpersona.per_lugresidencia = tlugar.lug_id
        """
        concedula = u" coalesce(per_ciruc,'')!='' and per_id>0" if solo_cedulas else ''

        if cadenas.es_nonulo_novacio(filtro):
            palabras = cadenas.strip_upper(filtro).split()
            filtromod = []
            for cad in palabras:
                filtromod.append(u"%{0}%".format(cad))

            nombreslike = u' '.join(filtromod)
            filtrocedulas = u" per_ciruc like '{0}%'".format(cadenas.strip(filtro))

            sql = u"""{basesql}
                        where ((per_nombres||' '||per_apellidos like '{nombreslike}') or ({filtrocedulas})) and {concedula} order by 4 limit {limit} offset {offset}
                    """.format(nombreslike=nombreslike,
                               concedula=concedula,
                               limit=limit,
                               offset=offsset,
                               filtrocedulas=filtrocedulas,
                               basesql=basesql)

            tupla_desc = ('per_id', 'per_ciruc', 'per_genero', 'nomapel', 'per_lugresidencia', 'lugresidencia')
            return self.all(sql, tupla_desc)
        else:
            sql = u"""{basesql} where {concedula}
             order by 4 limit {limit} offset {offset}
            """.format(basesql=basesql, limit=limit, offset=offsset, concedula=concedula)


        print 'sql es:'
        print sql

        tupla_desc = ('per_id', 'per_ciruc', 'per_genero', 'nomapel', 'per_lugresidencia', 'lugresidencia')
        return self.all(sql, tupla_desc)

    def existe_ciruc(self, per_ciruc):
        sql = u"select count(*) as cuenta from tpersona t where t.per_ciruc = '{0}'".format(per_ciruc)
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def existe_email(self, per_email):
        sql = "select count(*) as cuenta from tpersona t where t.per_email = '{0}'".format(per_email)
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def listar_por_tipo(self, per_tipo):
        sql = """
        select  per_id,        
                per_ciruc,     
                per_nombres,   
                per_apellidos, 
                per_direccion,
                per_telf,      
                per_movil,     
                per_email,     
                per_fecreg,    
                per_tipo,      
                per_lugnac,    
                per_nota from tpersona where per_tipo = {0} order by per_nombres
        """.format(per_tipo)

        tupla_desc = ('per_id',
                      'per_ciruc',
                      'per_nombres',
                      'per_apellidos',
                      'per_direccion',
                      'per_telf',
                      'per_movil',
                      'per_email',
                      'per_fecreg',
                      'per_tipo',
                      'per_lugnac',
                      'per_nota')

        return self.all(sql, tupla_desc)

    def actualizar(self, per_id, form):

        tpersona = self.get_entity_byid(per_id)
        if tpersona is not None:
            if not cadenas.es_nonulo_novacio(form['per_ciruc']):
                raise ErrorValidacionExc('Ingrese el número de cédula, ruc o pasaporte')

            if not cadenas.es_nonulo_novacio(form['per_nombres']):
                raise ErrorValidacionExc('Ingrese los nombres')

            current_email = cadenas.strip(tpersona.per_email)
            per_email = cadenas.strip(form['per_email'])
            if current_email != per_email and cadenas.es_nonulo_novacio(current_email):
                if self.existe_email(per_email=form['per_email']):
                    raise ErrorValidacionExc(
                        'Ya existe una persona registrada con la dirección de correo, ingrese otra: {0}'.format(
                            form['per_email']))

            if not cadenas.es_nonulo_novacio(per_email):
                per_email = None

            per_ciruc = cadenas.strip(form['per_ciruc'])
            current_per_ciruc = cadenas.strip(tpersona.per_ciruc)
            if per_ciruc != current_per_ciruc:
                if self.existe_ciruc(per_ciruc=form['per_ciruc']):
                    raise ErrorValidacionExc(
                        'El número de ci/ruc o pasaporte {0} ya está registrado, ingrese otro'.format(
                            form['per_ciruc']))
                else:
                    tpersona.per_ciruc = per_ciruc

            tpersona.per_nombres = cadenas.strip_upper(form['per_nombres'])
            tpersona.per_apellidos = cadenas.strip_upper(form['per_apellidos'])
            tpersona.per_movil = cadenas.strip_upper(form['per_movil'])
            tpersona.per_email = per_email
            if 'per_direccion' in form:
                tpersona.per_direccion = cadenas.strip(form['per_direccion'])

            # Columnas agregadas:
            if 'per_fechanacp' in form:
                per_fechanac_txt = form['per_fechanacp']
                if cadenas.es_nonulo_novacio(per_fechanac_txt):
                    per_fechanac = fechas.parse_cadena(per_fechanac_txt)
                    tpersona.per_fechanac = per_fechanac

            elif 'per_fechanac' in form:
                per_fechanac_txt = form['per_fechanac']
                if cadenas.es_nonulo_novacio(per_fechanac_txt):
                    per_fechanac = fechas.parse_cadena(per_fechanac_txt)
                    tpersona.per_fechanac = per_fechanac

            if 'per_genero' in form:
                per_genero = form['per_genero']
                tpersona.per_genero = per_genero

            if 'per_estadocivil' in form:
                if type(form['per_estadocivil']) is dict:
                    per_estadocivil = form['per_estadocivil']['lval_id']
                else:
                    per_estadocivil = form['per_estadocivil']
                tpersona.per_estadocivil = per_estadocivil

            if 'per_lugresidencia' in form:
                if type(form['per_lugresidencia']) is dict:
                    per_lugresidencia = form['per_lugresidencia']['lug_id']
                else:
                    per_lugresidencia = form['per_lugresidencia']

                if per_lugresidencia != 0:
                    tpersona.per_lugresidencia = per_lugresidencia

            if 'per_telf' in form:
                per_telf = form['per_telf']
                tpersona.per_telf = cadenas.strip(per_telf)

            if 'per_ocupacion' in form:
                if type(form['per_ocupacion']) is dict:
                    per_ocupacion = form['per_ocupacion']['lval_id']
                else:
                    per_ocupacion = form['per_ocupacion']
                tpersona.per_ocupacion = per_ocupacion

            self.dbsession.add(tpersona)
            self.dbsession.flush()

    def crear(self, form, permit_ciruc_null=False):
        if not permit_ciruc_null:
            if not cadenas.es_nonulo_novacio(form['per_ciruc']):
                raise ErrorValidacionExc('Ingrese el número de cédula, ruc o pasaporte')

        per_ciruc = cadenas.strip_upper(form['per_ciruc'])
        if cadenas.es_nonulo_novacio(form['per_ciruc']):
            if self.existe_ciruc(per_ciruc=form['per_ciruc']):
                raise ErrorValidacionExc(
                    'El número de ci/ruc o pasaporte {0} ya está registrado, ingrese otro'.format(form['per_ciruc']))
        else:
            per_ciruc = None

        if not cadenas.es_nonulo_novacio(form['per_nombres']):
            raise ErrorValidacionExc('Ingrese los nombres')

        if cadenas.es_nonulo_novacio(form['per_email']):
            if self.existe_email(per_email=form['per_email']):
                raise ErrorValidacionExc(
                    'Ya existe una persona registrada con la dirección de correo: {0}'.format(form['per_email']))
        else:
            form['per_email'] = None

        tpersona = TPersona()
        tpersona.per_nombres = cadenas.strip_upper(form['per_nombres'])
        tpersona.per_apellidos = cadenas.strip_upper(form['per_apellidos'])
        tpersona.per_ciruc = per_ciruc
        # tpersona.per_direccion = cadenas.strip_upper(form['per_direccion'])
        if 'per_direccion' in form:
            tpersona.per_direccion = cadenas.strip(form['per_direccion'])

        # tpersona.per_telf = cadenas.strip_upper(form['per_telf'])
        tpersona.per_telf = ''
        tpersona.per_movil = cadenas.strip_upper(form['per_movil'])
        tpersona.per_email = cadenas.strip(form['per_email'])
        tpersona.per_fecreg = datetime.now()
        # tpersona.per_tipo = form['per_tipo']
        tpersona.per_tipo = form['per_tipo']
        # tpersona.per_lugnac = form['per_lugnac']
        tpersona.per_lugnac = 0
        # tpersona.per_nota = cadenas.strip(form['per_nota'])
        tpersona.per_nota = ''

        # Columnas agregadas:
        if 'per_fechanac' in form:
            per_fechanac_txt = form['per_fechanac']
            if cadenas.es_nonulo_novacio(per_fechanac_txt):
                per_fechanac = fechas.parse_cadena(per_fechanac_txt)
                tpersona.per_fechanac = per_fechanac

        if 'per_estadocivil' in form:
            if type(form['per_estadocivil']) is dict:
                per_estadocivil = form['per_estadocivil']['lval_id']
            else:
                per_estadocivil = form['per_estadocivil']
            tpersona.per_estadocivil = per_estadocivil

        if 'per_lugresidencia' in form:
            if type(form['per_lugresidencia']) is dict:
                per_lugresidencia = form['per_lugresidencia']['lug_id']
            else:
                per_lugresidencia = form['per_lugresidencia']

            if per_lugresidencia != 0:
                tpersona.per_lugresidencia = per_lugresidencia

        if 'per_genero' in form:
            per_genero = form['per_genero']
            tpersona.per_genero = per_genero

        if 'per_telf' in form:
            per_telf = form['per_telf']
            tpersona.per_telf = cadenas.strip(per_telf)

        if 'per_ocupacion' in form:
            if type(form['per_ocupacion']) is dict:
                per_ocupacion = form['per_ocupacion']['lval_id']
            else:
                per_ocupacion = form['per_ocupacion']
            tpersona.per_ocupacion = per_ocupacion

        self.dbsession.add(tpersona)
        self.dbsession.flush()

        return tpersona.per_id
