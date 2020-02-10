# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging

from cornice.resource import resource

from fusayal.logica.fusay.tevents.tevents_dao import TFusayEventsDao
from fusayal.logica.fusay.tlugarcer.tlugarcer_dao import TFusayLugarEvDao
from fusayal.logica.fusay.ttiposcer.ttipocer_dao import TFusayTipEventDao
from fusayal.utils.pyramidutil import FusayPublicView

log = logging.getLogger(__name__)


@resource(collection_path='/api/fusay/events', path='/api/fusay/events/{ev_id}', cors_origins=('*',))
class TFusayEventsRest(FusayPublicView):

    def get(self):
        ev_id = self.get_request_matchdict('ev_id')
        tevents_dao = TFusayEventsDao(self.dbsession)
        event = tevents_dao.find_byid(ev_id=ev_id)
        if event is not None:
            return {'status': 200, 'event': event}
        else:
            return {'status': 404}

    def collection_get(self):
        accion = self.get_request_param('accion')
        if 'listas' == accion:
            tipev_dao = TFusayTipEventDao(self.dbsession)
            lugev_dao = TFusayLugarEvDao(self.dbsession)

            tiposev = tipev_dao.listar()
            lugarev = lugev_dao.listar()

            return {
                'status': 200,
                'listas': {'tiposev': tiposev, 'lugaresev': lugarev}
            }
        elif 'form' == accion:
            tevents_dao = TFusayEventsDao(self.dbsession)
            form = tevents_dao.get_form()
            return {'status': 200, 'form': form}
        elif 'data' == accion:
            tevents_dao = TFusayEventsDao(self.dbsession)
            eventslist = tevents_dao.listar()
            return {'status': 200, 'data': eventslist}

    """
    def post(self):
        log.info('Se ejecuta post para servicio rest-->')
        jsonbody = self.get_request_json_body()
        ev_id = self.get_request_matchdict('ev_id')
        tevents_dao = TFusayEventsDao(self.dbsession)
        tevents_dao.crear(ev_fecha=jsonbody['ev_fecha'],
                          ev_lugar=jsonbody['codlugar'],
                          ev_horaini=jsonbody['ev_horaini'],
                          ev_horafin=jsonbody['ev_horafin'],
                          ev_nota=jsonbody['ev_nota'],
                          ev_publ='',
                          ev_tipo=jsonbody['codtipo'],
                          ev_precionormal=jsonbody['ev_precionormal'],
                          ev_precioespecial=jsonbody['ev_precioespecial'])
        return {'status': 200, 'msg': 'Registro exitoso'}
    """

    def collection_post(self):
        log.info('Se ejecuta post para servicio rest-->')
        jsonbody = self.get_request_json_body()

        accion = None
        tevents_dao = TFusayEventsDao(self.dbsession)
        if 'accion' in self.request.params:
            accion = self.get_request_param('accion')

        if accion is not None:
            if accion == 'anular':
                tevents_dao.cambiar_estado(ev_id=jsonbody['ev_id'], ev_estado=1)
                return {'status': 200, 'msg': 'El evento ha sido anulado'}
            elif accion == 'guardar':
                tevents_dao.crear(ev_fecha=jsonbody['ev_fechap'],
                                  ev_lugar=jsonbody['codlugar'],
                                  ev_horaini=jsonbody['ev_horainiciop'],
                                  ev_horafin=jsonbody['ev_horafinp'],
                                  ev_nota=jsonbody['ev_nota'],
                                  ev_publ='',
                                  ev_tipo=jsonbody['codtipo'],
                                  ev_precionormal=jsonbody['ev_precionormal'],
                                  ev_precioespecial=jsonbody['ev_precioespecial'])
                return {'status': 200, 'msg': 'Registro exitoso'}
            else:
                return {'status': 200, 'msg': 'Ninguna accion realizada, la accion es deconocida'}
        else:
            return {'status': 200, 'msg': 'Ninguna accion realizada, la accion es deconocida'}
