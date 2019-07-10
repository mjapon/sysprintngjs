# -*- coding:UTF-8 -*-
"""
Created on '02/12/2014'
@author: 'Manuel'
"""
import logging

from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.utils.jsonutil import SimpleJsonUtil

log = logging.getLogger(__name__)


class BaseDao(SimpleJsonUtil):

    def __init__(self, dbsession):
        self.dbsession = dbsession

    def set_esquema(self, esquema):
        self.dbsession.execute("SET search_path TO {0}".format(esquema))

    def get_dbsession_by_esquema(self, esquema=None):
        sess =self.dbsession
        if esquema is not None:
           sess.execute("SET search_path TO {0}".format(esquema))
        return sess

    def set_esquema_acad(self):
        self.dbsession.execute("SET search_path TO {0}".format(self.get_esquema_acad()))

    def get_dbsession_acad(self):
        acf_esquema_acad = self.get_esquema_acad()
        if acf_esquema_acad is None:
            raise ErrorValidacionExc(u"No esta definido acf_esquema_acad en tappconfig")

        return self.get_dbsession_by_esquema(acf_esquema_acad)

    def mensaje(self, estado, mensaje):
        return {'estado': estado, 'msg': mensaje}

    def all(self, sql, tupla_desc):
        res = self.dbsession.query(*tupla_desc).from_statement(sql).all()
        return self.make_json_list(res, tupla_desc)

    def first(self, sql, tupla_desc):
        tupla_res = self.dbsession.query(*tupla_desc).from_statement(sql).first()
        return None if tupla_res is None else self.tupla_to_json(tupla_res, tupla_desc)

    def first_col(self, sql, col):
        tupla_res = self.dbsession.query(col).from_statement(sql).first()
        return tupla_res[0] if tupla_res is not None and tupla_res[0] is not None else None