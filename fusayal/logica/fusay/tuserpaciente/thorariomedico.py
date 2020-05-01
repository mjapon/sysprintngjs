# coding: utf-8
"""
Fecha de creacion 4/25/20
@autor: mjapon
"""
import logging
from sqlalchemy import Column, Integer, TIMESTAMP, String, Text, Time

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class THorarioMedico(Declarative, JsonAlchemy):
    __tablename__ = 'thorariomedico'

    hm_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    med_id = Column(Integer, nullable=False)
    hm_dia = Column(Integer, nullable=False)
    hm_horaini = Column(Time, nullable=False)
    hm_horafin= Column(Time, nullable=False)