# coding: utf-8
"""
Fecha de creacion 4/25/20
@autor: mjapon
"""
import logging
from decimal import Decimal

from sqlalchemy import Column, Integer, TIMESTAMP, String, Text, Date, Time, Numeric

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TCita(Declarative, JsonAlchemy):
    __tablename__ = 'tcita'

    cita_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    cita_fecha = Column(Date, nullable=False)
    cita_hora = Column(Numeric(4,2), nullable=False)
    cita_hora_fin = Column(Numeric(4,2), nullable=False)
    paciente_id = Column(Integer, nullable=False)
    cita_obs = Column(Text)
    medico_id = Column(Integer, nullable=False)
    cita_serv = Column(Integer, nullable=False)
    cita_estado = Column(Integer, nullable=False, default=0)  # 0-pendiente,1-atendido,2-anulado
