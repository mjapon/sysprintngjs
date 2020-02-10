# coding: utf-8
"""
Fecha de creacion 
@autor: 
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.logica.fusay.tpersonaevent.tpersonaevent_model import TPersonaEvent

log = logging.getLogger(__name__)


class TPersonaEventDao(BaseDao):

    def ya_esta_registrado(self, ev_id, per_id):
        sql = "select count(*) as cuenta from tpersonaevents t where t.ev_id = {0} and t.per_id = {1}".format(ev_id,
                                                                                                              per_id)
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def crear(self, ev_id, per_id):
        if not self.ya_esta_registrado(ev_id, per_id):
            tpersonaevent = TPersonaEvent()
            tpersonaevent.per_id = per_id
            tpersonaevent.ev_id = ev_id
            tpersonaevent.pev_fecreg = datetime.now()
            self.dbsession.add(tpersonaevent)

    def create_withpersonform(self, ev_id, person_form):
        tpersonadao = TPersonaDao(self.dbsession)
        tperson = tpersonadao.buscar_porciruc(per_ciruc=person_form['per_ciruc'])
        if tperson is not None:
            per_id = tperson['per_id']
        else:
            per_id = tpersonadao.crear(person_form)

        self.crear(ev_id=ev_id, per_id=per_id)