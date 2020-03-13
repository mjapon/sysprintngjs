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

    def post(self):
        # per_id = self.get_request_matchdict('per_id')
        tpersonadao = TPersonaDao(self.dbsession)
        form = self.get_json_body()
        per_id_gen = tpersonadao.crear(form=form)
        return {'status': 200, 'msg': 'Registrado exitosamente'}
