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

    def crear(self, form, user_crea):
        """
        Crea un nuevo contribuyente
        :param form:
        :return:
        """
        cnt_ruc = cadenas.strip(form.get('cnt_ruc'))
        if not cadenas.es_nonulo_novacio(cnt_ruc):
            raise ErrorValidacionExc("Debe ingresar el ruc")

        if self.ya_existe(cnt_ruc=cnt_ruc):
            raise ErrorValidacionExc("El contribuyente con número de ruc: {0} ya ha sido registrado".format(cnt_ruc))

        if not cadenas.es_nonulo_novacio(form['cnt_razonsocial']):
            raise ErrorValidacionExc("Ingrese la razón social")

        if not cadenas.es_nonulo_novacio(form['cnt_dirmatriz']):
            raise ErrorValidacionExc("Ingrese la dirección matriz")

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
