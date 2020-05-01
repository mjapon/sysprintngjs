# coding: utf-8
"""
Fecha de creacion 4/25/20
@autor: mjapon
"""
import logging
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

from sqlalchemy import Column, Integer, TIMESTAMP, String, Text

log = logging.getLogger(__name__)


class TServicioMedico(Declarative, JsonAlchemy):
    __tablename__ = 'tserviciomedico'

    tsm_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    med_id = Column(Integer, nullable=False)
    serv_id = Column(Integer, nullable=False)
