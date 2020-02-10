# coding: utf-8
"""
Fecha de creacion 27/12/2019
@autor: mejg231019
"""
import logging

from cornice.resource import resource

from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.logica.fusay.tpersonaevent.tpersonaevent_dao import TPersonaEventDao
from fusayal.utils.pyramidutil import FusayPublicView

log = logging.getLogger(__name__)


@resource(collection_path="/api/tpersonaevent", path="/api/tpersonaevent/{ev_id}/{per_id}", cors_origins=('*',))
class TPersonaEventRest(FusayPublicView):

    def collection_post(self):
        form = self.get_request_json_body()
        personaeventdao = TPersonaEventDao(self.dbsession)
        personaeventdao.create_withpersonform(ev_id=form['ev_id'], person_form=form)
        return {'status': 200, 'msg': 'Registro Exitoso'}

    def collection_get(self):
        accion = self.get_request_param('accion')
        if accion == 'buscaperevent':
            ev_id = self.get_request_param('ev_id')
            per_ciruc = self.get_request_param('ciruc')
            personadao = TPersonaDao(self.dbsession)
            person = personadao.buscar_porciruc(per_ciruc=per_ciruc)
            if person is not None:
                personaeventdao = TPersonaEventDao(self.dbsession)
                isregistered = personaeventdao.ya_esta_registrado(ev_id=ev_id, per_id=person['per_id'])
                return {'status': 200, 'registrado': isregistered}
            else:
                return {'status': 404}