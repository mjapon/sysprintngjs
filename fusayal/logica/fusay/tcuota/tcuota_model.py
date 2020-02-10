# coding: utf-8
"""
Fecha de creacion 04/01/2020
@autor: mejg231019
"""
import logging

from fusayal.models.conf import Declarative
from sqlalchemy import Column, Integer, DateTime, Numeric, Text

from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TCuota(Declarative, JsonAlchemy):
    __tablename__ = 'tcuota'

    cuo_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    tipc_id = Column(Integer, nullable=False)
    cuo_fecreg = Column(DateTime, nullable=False)
    cuo_anio = Column(Integer, nullable=False)
    cuo_mes = Column(Integer, nullable=False)
    cuo_monto = Column(Numeric(7, 2), nullable=False)
    cuo_socio = Column(Integer, nullable=False)
    cuo_usercrea = Column(Integer, nullable=False)
    cuo_obs = Column(Text)
    cuo_estado = Column(Integer, nullable=False, default=0)  # --0:valido, 1:anulado

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
