# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tevents.tevents_model import TFusayEvent
from fusayal.utils import fechas

log = logging.getLogger(__name__)


class TFusayEventsDao(BaseDao):

    def get_form(self):
        return {
            'ev_id': 0,
            'ev_fecha': fechas.get_str_fecha_actual(),
            'ev_lugar': 1,
            'ev_horainicio': '19:00',
            'ev_horafin': '09:00',
            'ev_nota': '',
            'ev_publicidad': '',
            'ev_tipo': 1,
            'ev_precionormal': 20.0,
            'ev_precioespecial': 10.0,
            'ev_img': ''
        }

    def crear(self, ev_fecha, ev_lugar, ev_horaini, ev_horafin, ev_nota, ev_publ,
              ev_tipo, ev_precionormal, ev_precioespecial):

        log.info('Valores para ev_horaini, ev_horafin----->')
        log.info(ev_horaini)
        log.info(ev_horafin)

        tfusayevent = TFusayEvent()
        # fechaev = fechas.parse_cadena(ev_fecha)
        # fechaev = fechas.parsedatefromisostr(ev_fecha)
        tfusayevent.ev_fecha = fechas.parse_cadena(ev_fecha)
        tfusayevent.ev_fechacrea = datetime.now()
        tfusayevent.ev_creadopor = 1
        tfusayevent.ev_lugar = ev_lugar
        tfusayevent.ev_horainicio = ev_horaini
        tfusayevent.ev_horafin = ev_horafin
        tfusayevent.ev_nota = ev_nota
        tfusayevent.ev_publicidad = ev_publ
        tfusayevent.ev_tipo = ev_tipo
        tfusayevent.ev_precionormal = ev_precionormal
        tfusayevent.ev_precioespecial = ev_precioespecial
        tfusayevent.ev_estado = 0

        self.dbsession.add(tfusayevent)

    def find_byid(self, ev_id):
        sql = """select 
                        a.ev_id,
                        a.ev_fecha,
                        a.ev_fechacrea,
                        a.ev_creadopor,
                        a.ev_lugar,
                        lg.lugc_nombre,
                        a.ev_horainicio,
                        a.ev_horafin,
                        a.ev_nota,
                        case when length(ev_nota)>250 then concat(substr(ev_nota,0,250),'...') else ev_nota end  as notaelip,
                        a.ev_publicidad,
                        a.ev_tipo,
                        te.tiev_nombre,
                        te.tiev_img,
                        a.ev_precionormal,
                        a.ev_precioespecial,
                        a.ev_img from tevents a 
                        join tlugarev lg on a.ev_lugar = lg.lugc_id
                        join ttipoev te on a.ev_tipo = te.tiev_id 
                        where a.ev_id = {0}                                
                """.format(ev_id)
        tupla_desc = ('ev_id',
                      'ev_fecha',
                      'ev_fechacrea',
                      'ev_creadopor',
                      'ev_lugar',
                      'lugc_nombre',
                      'ev_horainicio',
                      'ev_horafin',
                      'ev_nota',
                      'notaelip',
                      'ev_publicidad',
                      'ev_tipo',
                      'tiev_nombre',
                      'tiev_img',
                      'ev_precionormal',
                      'ev_precioespecial',
                      'ev_img')

        return self.first(sql, tupla_desc)

    def cambiar_estado(self, ev_id, ev_estado):
        tevent = self.dbsession.query(TFusayEvent).filter(TFusayEvent.ev_id == ev_id).first()

        if tevent is not None:
            tevent.ev_estado = ev_estado


    def listar(self):
        sql = """
            select 
                a.ev_id,
                a.ev_fecha,
                a.ev_fechacrea,
                a.ev_creadopor,
                a.ev_lugar,
                lg.lugc_nombre,
                a.ev_horainicio,
                a.ev_horafin,
                a.ev_nota,
                case when length(ev_nota)>250 then concat(substr(ev_nota,0,250),'...') else ev_nota end  as notaelip,
                a.ev_publicidad,
                a.ev_tipo,
                te.tiev_nombre,
                te.tiev_img,
                a.ev_precionormal,
                a.ev_precioespecial,
                a.ev_img,
                a.ev_url from tevents a
                join tlugarev lg on a.ev_lugar = lg.lugc_id
                join ttipoev te on a.ev_tipo = te.tiev_id       
                where a.ev_estado=0 and a.ev_fecha >= now()  order by a.ev_fecha
        """
        tupla_desc = ('ev_id',
                      'ev_fecha',
                      'ev_fechacrea',
                      'ev_creadopor',
                      'ev_lugar',
                      'lugc_nombre',
                      'ev_horainicio',
                      'ev_horafin',
                      'ev_nota',
                      'notaelip',
                      'ev_publicidad',
                      'ev_tipo',
                      'tiev_nombre',
                      'tiev_img',
                      'ev_precionormal',
                      'ev_precionormal',
                      'ev_precioespecial',
                      'ev_img',
                      'ev_url')

        return self.all(sql, tupla_desc)
