# coding: utf-8
"""
Fecha de creacion 3/5/20
@autor: mjapon
"""
import logging
from datetime import datetime

from cornice.resource import resource

from fusayal.logica.fusay.titemconfig.titemconfig_dao import TItemConfigDao
from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.logica.ttickets.tticket_dao import TTicketDao
from fusayal.utils import fechas
from fusayal.utils.pyramidutil import TokenView

log = logging.getLogger(__name__)


@resource(collection_path='/api/tticket', path='/api/tticket/{tk_id}', cors_origins=('*',))
class TTicketRest(TokenView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        ticket_dao = TTicketDao(self.dbsession)
        if 'form' == accion:
            persona_dao = TPersonaDao(self.dbsession)
            tk_dia = fechas.parse_fecha(datetime.now())
            form = ticket_dao.get_form(tk_dia, self.get_sec_id())
            formcli = persona_dao.getform()
            return {'status': 200, 'form': form, 'formcli': formcli}

        if 'servticktes' == accion:
            itemconfigdao = TItemConfigDao(self.dbsession)
            prods =  itemconfigdao.get_prods_for_tickets()
            return {'status':200, 'items':prods}

        if 'forml' == accion:
            return {'dia': fechas.parse_fecha(datetime.now())}

        if 'listar' == accion:
            res = ticket_dao.listar(dia=self.get_request_param('dia'), sec_id=self.get_sec_id())
            return {'status': 200, 'res': res}

    def collection_post(self):
        accion = self.get_request_param('accion')
        if accion == 'guardar':
            allform = self.get_request_json_body()
            formcli = allform['form_cli']
            form = allform['form']
            ticket_dao = TTicketDao(self.dbsession)
            tkid = ticket_dao.crear(form, formcli, self.get_user_id(), self.get_sec_id())
            return {'status': 200, 'msg': 'Registrado', 'tk_id':tkid}
        if accion == 'anular':
            form = self.get_json_body()
            tk_id = form['tk_id']

            ticket_dao = TTicketDao(self.dbsession)
            ticket_dao.anular(tk_id=tk_id)
            return {'status': 200, 'msg': 'Ticket anulado'}
