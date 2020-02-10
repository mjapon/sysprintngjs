# coding: utf-8
"""
Fecha de creacion 04/01/2020
@autor: mejg231019
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tcuota.tcuota_model import TCuota
from fusayal.utils import fechas

log = logging.getLogger(__name__)


class TCuotaDao(BaseDao):

    def get_form(self):
        """
        cuo_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        tipc_id INTEGER not null,
        cuo_fecreg DATETIME not null,
        cuo_anio  INTEGER not null,
        cuot_monto REAL not null default 10.0,
        cuo_socio INTEGER not null,
        cuo_usercrea INTEGER not null,
        cuo_obs TEXT,
        cuo_estado integer not null default 0 --0:valido, 1:anulado
        """
        form = {
            'cuo_id': 0,
            'tipc_id': 1,
            'cuo_anio': fechas.get_anio_actual(),
            'cuo_mes': fechas.get_mes_actual(),
            'cuot_monto': 10.0,
            'cuo_socio': 0,
            'cuo_usercrea': 0,
            'cuo_obs': '',
            'cuo_estado': 0
        }

    def get_tipos_cuota(self):
        sql = """
        select tipc_id, tipc_nombre from ttipocuota t
        """
        tupla_desc = ('tipc_id', 'tipc_nombre')
        return self.all(sql, tupla_desc)

    def cuota_registrada(self, cuo_socio, cuo_anio, cuo_mes):
        sql = """select count(*) as cuenta from tcuota t  
                where cuo_socio = {0} 
                and cuo_anio = {1} and 
                cuo_mes = {2} and
                cuo_estado = 0""".format(cuo_socio, cuo_anio, cuo_mes)
        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def crear(self, form):

        if self.cuota_registrada(cuo_socio=form['cuo_socio'],
                                 cuo_anio=form['cuo_anio'],
                                 cuo_mes=form['cuo_mes']):
            raise ErrorValidacionExc('Ya está registrada esta cuota, no es posible registrar la cuota nuevamente')

        tcuota = TCuota()
        tcuota.tipc_id = form['tipc_id']
        tcuota.cuo_fecreg = datetime.now()
        tcuota.cuo_anio = form['cuo_anio']
        tcuota.cuo_mes = form['cuo_mes']
        tcuota.cuo_monto = form['cuo_monto']
        tcuota.cuo_socio = form['cuo_socio']
        tcuota.cuo_usercrea = form['cuo_usercrea']
        tcuota.cuo_obs = form['cuo_obs']
        tcuota.cuo_estado = 0

        self.dbsession.add(tcuota)

    def anular(self, cuo_id):
        tcuota = self.dbsession.query(TCuota).filter(TCuota.cuo_id == cuo_id).first()
        if tcuota is not None:
            tcuota.cuo_estado = 1
            self.dbsession.add(tcuota)
            return 1
        return -1
