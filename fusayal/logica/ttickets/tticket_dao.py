# coding: utf-8
"""
Fecha de creacion 3/5/20
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tgrid.tgrid_dao import TGridDao
from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.logica.ttickets.tticket_model import TTicket
from fusayal.utils import fechas

log = logging.getLogger(__name__)


class TTicketDao(BaseDao):

    def get_entity_byid(self, tk_id):
        return self.dbsession.query(TTicket).filter(TTicket.tk_id == tk_id).first()

    def anular(self, tk_id):
        tticket = self.get_entity_byid(tk_id)
        if tticket is not None:
            tticket.tk_estado = 2
            self.dbsession.add(tticket)

    def listar(self, dia,sec_id):
        tgrid_dao = TGridDao(self.dbsession)

        diadb = fechas.format_cadena_db(dia)

        data = tgrid_dao.run_grid(grid_nombre='tickets', tk_dia=diadb, sec_id=sec_id)
        return data

    def get_next_ticket(self, dia):

        sql = """
        select coalesce(max(tk_nro),0) as maxticket 
        from ttickets a where a.tk_estado=1 and a.tk_dia = '{0}' """.format(dia)

        maxticket = self.first_col(sql, 'maxticket')
        return maxticket + 1

    def get_form(self, dia):
        tk_nro = self.get_next_ticket(fechas.format_cadena_db(dia))

        dia_str = fechas.getDiaFechaLetras1(fechas.parse_cadena(dia))

        return {
            'tk_id': 0,
            'per_id': 0,
            'tk_nro': tk_nro,
            'tk_obs': '',
            'tk_costo': 1.0,
            'tk_dia': dia,
            'tk_servicios': '',
            'dia_str': dia_str
        }

    def crear(self, form, form_persona, user_crea, sec_id):

        tticket = TTicket()

        persona_dao = TPersonaDao(self.dbsession)

        tticket.tk_nro = form['tk_nro']
        tticket.tk_fechahora = datetime.now()

        per_id = form_persona['per_id']
        if per_id is None or per_id == 0:
            per_id = persona_dao.crear(form_persona)
        else:
            persona_dao.actualizar(per_id, form_persona)

        tticket.tk_perid = per_id
        tticket.tk_observacion = form['tk_obs']
        tticket.tk_usercrea = user_crea
        tticket.tk_costo = form['tk_costo']
        tticket.tk_dia = fechas.parse_cadena(form['tk_dia'])
        tticket.tk_estado = 1
        tticket.tk_servicios = form['tk_servicios']
        tticket.sec_id = sec_id

        self.dbsession.add(tticket)

        self.dbsession.flush()
        return tticket.tk_id

