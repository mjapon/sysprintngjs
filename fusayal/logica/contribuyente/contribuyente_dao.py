# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import copy
import logging

from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.logica.contribuyente.contribuyente_model import TContribuyente
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.utils import enums, checkcambioutil
from fusayal.utils import cadenas

log = logging.getLogger(__name__)


class TContribuyenteDao(BaseDao):

    def get_form(self):
        form = {
            'cnt_id': 0,
            'cnt_ruc': '',
            'cnt_razonsocial': '',
            'cnt_nombre'
            'cnt_telf': '',
            'cnt_email': '',
            'cnt_dirmatriz': '',
            'cnt_direstab': '',
            'cnt_clase': 1,
            'cnt_nrocntespecial': '',
            'cnt_oblcontab': 0,
            'cnt_nombrecomercial': ''
        }
        return form

    def get_tipos_contribuyentes(self):
        sql = " select cls_id, cls_nombre from tclasecontrib order by cls_id"
        tupla_desc = ('cls_id', 'cls_nombre')
        return self.all(sql, tupla_desc)

    def find_by_ruc(self, ruc):
        sql = """
                            select cnt_id,
                                   cnt_ruc,
                                   cnt_razonsocial,
                                   cnt_nombrecomercial,
                                   cnt_telf,
                                   cnt_email,
                                   cnt_dirmatriz,
                                   cnt_clase,
                                   cls.cls_nombre,
                                   cnt_nrocntespecial,
                                   cnt_oblcontab,
                                   case cnt_oblcontab when 1 then 'SI' else 'NO' end as ocontab  from tcontribuyente a
                              join tclasecontrib cls on a.cnt_clase = cls.cls_id
                              where a.cnt_ruc = '{0}'
                            ORDER BY  cnt_razonsocial
                        """.format(ruc)

        tupla_desc = ('cnt_id',
                      'cnt_ruc',
                      'cnt_razonsocial',
                      'cnt_nombrecomercial',
                      'cnt_telf',
                      'cnt_email',
                      'cnt_dirmatriz',
                      'cnt_clase',
                      'cls_nombre',
                      'cnt_nrocntespecial',
                      'cnt_oblcontab',
                      'ocontab')

        return self.first(sql=sql, tupla_desc=tupla_desc)

    def get_form_edit(self, cnt_id):

        sql = """
                    select cnt_id,
                           cnt_ruc,
                           cnt_razonsocial,
                           cnt_nombrecomercial,
                           cnt_telf,
                           cnt_email,
                           cnt_dirmatriz,
                           cnt_clase,
                           cls.cls_nombre,
                           cnt_nrocntespecial,
                           cnt_oblcontab,
                           case cnt_oblcontab when 1 then 'SI' else 'NO' end as ocontab  from tcontribuyente a
                      join tclasecontrib cls on a.cnt_clase = cls.cls_id
                      where a.cnt_id = {0}
                    ORDER BY  cnt_razonsocial
                """.format(cnt_id)

        tupla_desc = ('cnt_id',
                      'cnt_ruc',
                      'cnt_razonsocial',
                      'cnt_nombrecomercial',
                      'cnt_telf',
                      'cnt_email',
                      'cnt_dirmatriz',
                      'cnt_clase',
                      'cls_nombre',
                      'cnt_nrocntespecial',
                      'cnt_oblcontab',
                      'ocontab')

        return self.first(sql=sql, tupla_desc=tupla_desc)

    def listar(self):
        sql = """
            select cnt_id,
                   cnt_ruc,
                   cnt_razonsocial,
                   cnt_nombrecomercial,
                   cnt_telf,
                   cnt_email,
                   cnt_dirmatriz,
                   cnt_clase,
                   cls.cls_nombre,
                   cnt_nrocntespecial,
                   cnt_oblcontab,
                   case cnt_oblcontab when 1 then 'SI' else 'NO' end as ocontab  from tcontribuyente a
              join tclasecontrib cls on a.cnt_clase = cls.cls_id
            ORDER BY  cnt_razonsocial
        """

        tupla_desc = ('cnt_id',
                      'cnt_ruc',
                      'cnt_razonsocial',
                      'cnt_nombrecomercial',
                      'cnt_telf',
                      'cnt_email',
                      'cnt_dirmatriz',
                      'cnt_clase',
                      'cls_nombre',
                      'cnt_nrocntespecial',
                      'cnt_oblcontab',
                      'ocontab')

        return self.all(sql=sql, tupla_desc=tupla_desc)

    def ya_existe(self, cnt_ruc):
        """
        Verifica si un contribuyente ya ha sido registrado
        :param cnt_ruc:
        :return:
        """
        sql = "select count(*) as cuenta from tcontribuyente where cnt_ruc = '{0}'".format(cnt_ruc)
        cuenta = self.first_col(sql, col='cuenta')
        return cuenta > 0

    @staticmethod
    def verificar(nro):
        l = len(nro)
        result = False
        if l == 10 or l == 13:  # verificar la longitud correcta
            cp = int(nro[0:2])
            if cp >= 1 and cp <= 22:  # verificar codigo de provincia
                tercer_dig = int(nro[2])
                if tercer_dig >= 0 and tercer_dig < 6:  # numeros enter 0 y 6
                    if l == 10:
                        result = TContribuyenteDao.validar_ced_ruc(nro, 0)
                    elif l == 13:
                        result = TContribuyenteDao.validar_ced_ruc(nro, 0) and nro[
                                                             10:13] != '000'  # se verifica q los ultimos numeros no sean 000
                elif tercer_dig == 6:
                    result = TContribuyenteDao.validar_ced_ruc(nro, 1)  # sociedades publicas
                elif tercer_dig == 9:  # si es ruc
                    result = TContribuyenteDao.validar_ced_ruc(nro, 2)  # sociedades privadas
                else:
                    result = False
                    #raise Exception(u'Tercer digito invalido')
            else:
                result = False
                #raise Exception(u'Codigo de provincia incorrecto')
        else:
            result = False
            #raise Exception(u'Longitud incorrecta del numero ingresado')

        return result

    @staticmethod
    def validar_ced_ruc(nro, tipo):
        total = 0
        if tipo == 0:  # cedula y r.u.c persona natural
            base = 10
            d_ver = int(nro[9])  # digito verificador
            multip = (2, 1, 2, 1, 2, 1, 2, 1, 2)
        elif tipo == 1:  # r.u.c. publicos
            base = 11
            d_ver = int(nro[8])
            multip = (3, 2, 7, 6, 5, 4, 3, 2)
        elif tipo == 2:  # r.u.c. juridicos y extranjeros sin cedula
            base = 11
            d_ver = int(nro[9])
            multip = (4, 3, 2, 7, 6, 5, 4, 3, 2)
        for i in range(0, len(multip)):
            p = int(nro[i]) * multip[i]
            if tipo == 0:
                total += p if p < 10 else int(str(p)[0]) + int(str(p)[1])
            else:
                total += p
        mod = total % base
        val = base - mod if mod != 0 else 0
        return val == d_ver


    def crear(self, form, user_crea):
        """
        Crea un nuevo contribuyente
        :param form:
        :return:
        """
        cnt_ruc = cadenas.strip(form.get('cnt_ruc'))
        if not cadenas.es_nonulo_novacio(cnt_ruc):
            raise ErrorValidacionExc("Debe ingresar el ruc")

        if not cnt_ruc.isdigit():
            raise ErrorValidacionExc("El ruc ingresado es incorrecto")

        #Logica para validacion de ruc
        resvalid = TContribuyenteDao.verificar(cnt_ruc)
        if not resvalid:
            raise ErrorValidacionExc(u"El número de ruc ingresado es incorrecto")

        if self.ya_existe(cnt_ruc=cnt_ruc):
            raise ErrorValidacionExc(u"El contribuyente con número de ruc: {0} ya ha sido registrado".format(cnt_ruc))

        if not cadenas.es_nonulo_novacio(form['cnt_razonsocial']):
            raise ErrorValidacionExc(u"Ingrese la razón social")

        if not cadenas.es_nonulo_novacio(form['cnt_dirmatriz']):
            raise ErrorValidacionExc(u"Ingrese la dirección matriz")

        # if not cadenas.es_nonulo_novacio(form['cnt_nombrecomercial']):
        #     raise ErrorValidacionExc("Ingrese el nombre comercial")

        tcontribuyente = TContribuyente()
        tcontribuyente.cnt_ruc = cnt_ruc
        tcontribuyente.cnt_razonsocial = form.get('cnt_razonsocial').upper()
        tcontribuyente.cnt_telf = form.get('cnt_telf')
        tcontribuyente.cnt_email = form.get('cnt_email')
        tcontribuyente.cnt_dirmatriz = form.get('cnt_dirmatriz')
        tcontribuyente.cnt_clase = form.get('cnt_clase')
        tcontribuyente.cnt_nrocntespecial = form.get('cnt_nrocntespecial')
        # tcontribuyente.cnt_oblcontab = 1 if form.get('cnt_oblcontab') else 0
        tcontribuyente.cnt_oblcontab = form.get('cnt_oblcontab')
        tcontribuyente.cnt_nombrecomercial = form.get('cnt_nombrecomercial')
        tcontribuyente.cnt_direstab = form.get('cnt_direstab')

        self.dbsession.add(tcontribuyente)
        self.dbsession.flush()

        # Agregar informacion de auditoria
        tautditdao = TAuditDao(self.dbsession)
        tautditdao.crea_accion_insert(enums.TBL_CONTRIBUYENTE, user_crea, tcontribuyente.cnt_id)
        return tcontribuyente.cnt_id

    def editar(self, form, user_edit):
        """
        Editar la informacion de un contribuyente
        :param cnt_codigo:
        :param form:
        :return:
        """
        cnt_id = form['cnt_id']
        tcontribuyente = self.dbsession.query(TContribuyente).filter(TContribuyente.cnt_id == cnt_id).first()
        if tcontribuyente is not None:

            cnt_ruc = cadenas.strip(form.get('cnt_ruc'))
            if not cadenas.es_nonulo_novacio(cnt_ruc):
                raise ErrorValidacionExc("Debe ingresar el ruc")

            current_ruc = form['cnt_ruc']
            if current_ruc != tcontribuyente.cnt_ruc:
                if self.ya_existe(cnt_ruc=cnt_ruc):
                    raise ErrorValidacionExc(
                        "El contribuyente con número de ruc: {0} ya ha sido registrado".format(cnt_ruc))

            if not cadenas.es_nonulo_novacio(form['cnt_razonsocial']):
                raise ErrorValidacionExc("Ingrese la razón social")

            if not cadenas.es_nonulo_novacio(form['cnt_dirmatriz']):
                raise ErrorValidacionExc("Ingrese la dirección matriz")

            # if not cadenas.es_nonulo_novacio(form['cnt_nombrecomercial']):
            #     raise ErrorValidacionExc("Ingrese el nombre comercial")

            #Clonamos el objeto para auditoria
            tcontribuyente_cloned = copy.copy(tcontribuyente)

            tcontribuyente.cnt_ruc = cnt_ruc
            tcontribuyente.cnt_razonsocial = form.get('cnt_razonsocial').upper()
            tcontribuyente.cnt_telf = form.get('cnt_telf')
            tcontribuyente.cnt_email = form.get('cnt_email')
            tcontribuyente.cnt_dirmatriz = form.get('cnt_dirmatriz')
            tcontribuyente.cnt_clase = form.get('cnt_clase')
            tcontribuyente.cnt_nrocntespecial = form.get('cnt_nrocntespecial')
            tcontribuyente.cnt_oblcontab = form.get('cnt_oblcontab')
            tcontribuyente.cnt_nombrecomercial = form.get('cnt_nombrecomercial')

        # Agregamos informacion de auditoria
        tauditdao = TAuditDao(self.dbsession)
        list_cambios = checkcambioutil.valor_cambiado(tcontribuyente_cloned.__json__(), form)
        if list_cambios is not None and len(list_cambios) > 0:
            for row in list_cambios:
                col = row['col']
                valorant = row['valorant']
                valordesp = row['valordesp']
                tauditdao.crea_accion_update(enums.TBL_CONTRIBUYENTE, col, user_edit, valorant, valordesp, tcontribuyente.cnt_id)

        return cnt_id
