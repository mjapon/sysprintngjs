# coding: utf-8
"""
Fecha de creacion 28/7/18
@autor: mjapon
"""
from cornice.resource import resource

from fusayal.logica.socios.socios_dao import TSociosDao
from fusayal.utils.jsonutil import SimpleJsonUtil
from fusayal.utils.pyramidutil import DbComunView


@resource(path="/rest/socios/{id}", collection_path="/rest/socios")
class SociosRest(DbComunView):

    def __init__(self, request, context=None):
        DbComunView.__init__(self,request)
        self.socios_dao = TSociosDao(self.dbsession)

    def collection_get(self):
        socios_list = self.socios_dao.listar()
        return {"items": socios_list}

    def get(self):
        return {'vacio':'vacio'}