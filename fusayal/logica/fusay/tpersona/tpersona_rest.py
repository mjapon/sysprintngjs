# coding: utf-8
"""
Fecha de creacion 
@autor: 
"""
import logging

from cornice.resource import resource

from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.utils.pyramidutil import FusayPublicView

log = logging.getLogger(__name__)


@resource(collection_path='/api/tpersona', path='/api/tpersona/{per_id}', cors_origins=('*',))
class TPersonaRest(FusayPublicView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        if 'form' == accion:
            tpersonadao = TPersonaDao(self.dbsession)
            form = tpersonadao.getform()
            return {'status': 200, 'form': form}
        elif 'buscaci' == accion:
            tpersonadao = TPersonaDao(self.dbsession)
            res = tpersonadao.buscar_porciruc(per_ciruc=self.get_request_param('ciruc'))
            if res is not None:
                return {'status': 200, 'persona': res}
            else:
                return {'status': 404}
        elif 'buscaemail' == accion:
            tpersonadao = TPersonaDao(self.dbsession)
            res = tpersonadao.buscar_poremail(per_ciruc=self.get_request_param('email'))
            if res is not None:
                return {'status': 200, 'persona': res}
            else:
                return {'status': 404}
        elif 'buscatipo' == accion:
            tpersonadao = TPersonaDao(self.dbsession)
            per_tipo = self.get_request_param('per_tipo')
            res = tpersonadao.listar_por_tipo(per_tipo)
            return {'status': 200, 'items': res}
        elif 'filtronomapel' == accion:
            filtro = self.get_request_param('filtro')
            tpersonadao = TPersonaDao(self.dbsession)
            res = tpersonadao.buscar_pornomapelci(filtro)
            return {'status': 200, 'items': res}
        elif 'filtropag' == accion:
            filtro = self.get_request_param('filtro')
            lastpage = self.get_request_param('pag')
            intlastpage = 0
            try:
                intlastpage = int(lastpage)
            except Exception as ex:
                log.error('Error al parsear a int la pagina', ex)

            tpersonadao = TPersonaDao(self.dbsession)
            limit = 10
            offset = intlastpage * limit
            items = tpersonadao.buscar_pornomapelci(filtro, solo_cedulas=True, limit=limit, offsset=offset)
            hasMore = items is not None and len(items) == limit
            return {'status': 200, 'items': items, 'hasMore': hasMore, 'nextp': intlastpage+1}

    def post(self):
        # per_id = self.get_request_matchdict('per_id')
        tpersonadao = TPersonaDao(self.dbsession)
        form = self.get_json_body()
        per_id_gen = tpersonadao.crear(form=form)
        return {'status': 200, 'msg': u'Registrado exitosamente', 'per_id': per_id_gen}

    def put(self):
        per_id = self.get_request_matchdict('per_id')
        tpersonadao = TPersonaDao(self.dbsession)
        form = self.get_json_body()
        res = tpersonadao.actualizar(per_id=per_id, form=form)
        return {'status': 200, 'msg': u'Actualizado exitosamente'}
