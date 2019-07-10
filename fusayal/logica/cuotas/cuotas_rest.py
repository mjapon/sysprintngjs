# coding: utf-8
"""
Fecha de creacion 26/8/18
@autor: mjapon
"""
from fusayal.logica.cuotas.cuotas_dao import TCuotasDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource


@resource(path="/rest/cuotas/{socioid}", collection_path="/rest/cuotas")
class CuotasRest(DbComunView):

    def __init__(self, request):
        DbComunView.__init__(self, request)
        self.cuotas_dao = TCuotasDao(self.dbsession)

    def get(self):
        socio_id = self.request.matchdict['socioid']

        if 'form' in self.request.params:
            pass

        anio = self.request.params['anio']
        tipo = self.request.params['tipo']

        matriz = self.cuotas_dao.get_matriz(socio_id, anio, tipo)

        return {'status':200, 'matriz':matriz}

    def post(self):
        form = self.get_json_body()
        res = self.cuotas_dao.registrar_cuota(
            socio_id=form['socio_id'],
            tipo_cuota=form['tipo'],
            anio=form['anio'],
            mes=form['mes'],
            monto=form['monto'],
            socio_id_reg=self.gsession('socioid'),
            path_compro='',
            obs=form['obs']
        )

        return {'status':200, 'res':res}